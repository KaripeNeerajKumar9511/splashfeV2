import { useState, useEffect, useMemo } from "react"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiService, setOopsRetry } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { useImageGeneration } from "@/context/ImageGenerationContext"
import { isAiServerDownError } from "@/lib/aiGenerationGuard"
import { isOopsNotifiedError, notifyOopsError } from "@/lib/oopsError"
import { FieldIndication } from "@/components/FieldIndication"

function selectionNeedsModel(imageTypeSelections) {
    if (!imageTypeSelections) return false
    return Object.values(imageTypeSelections).some(
        (sel) => sel && typeof sel === "object" && (sel.model || sel.campaign)
    )
}

function selectionHasProductOnlyTypes(imageTypeSelections) {
    if (!imageTypeSelections) return false
    return Object.values(imageTypeSelections).some(
        (sel) => sel && typeof sel === "object" && (sel.plainBg || sel.bgReplace)
    )
}

export function GenerateSection({ project, collectionData, onGenerate, canEdit, isOwner = false, productUploadPageRef = null }) {
    const [generating, setGenerating] = useState(false)
    const [indication, setIndication] = useState(null)
    const [success, setSuccess] = useState(null)
    const [selectedModel, setSelectedModel] = useState(null)
    const [generationProgress, setGenerationProgress] = useState(null)
    const [selections, setSelections] = useState(null)
    const { token } = useAuth()
    const { setIsGenerating } = useImageGeneration()
    
    useEffect(() => {
        const loadSelectedModel = async () => {
            if (collectionData?.id) {
                try {
                    const response = await apiService.getAllModels(collectionData.id, token)
                    const sm = response?.selected_model
                    const path = sm?.local || sm?.cloud || null
                    if (response.success && path) {
                        setSelectedModel(path)
                    } else {
                        setSelectedModel(null)
                    }
                } catch (err) {
                    console.error('Error loading selected model:', err)
                    setSelectedModel(null)
                }
            }
        }
        loadSelectedModel()
    }, [collectionData, token])

    useEffect(() => {
        const buildFromCollection = () => {
            const products = collectionData?.items?.[0]?.product_images || []
            if (!products.length) return null
            const fromCollection = {}
            products.forEach((product, index) => {
                const sel = product.generation_selections || {}
                fromCollection[index] = {
                    plainBg: Boolean(sel.plainBg),
                    bgReplace: Boolean(sel.bgReplace),
                    model: Boolean(sel.model),
                    campaign: Boolean(sel.campaign),
                    plainBgColor: sel.plainBgColor || "#ffffff",
                    modelTiers: sel.modelTiers || {},
                    aspectRatios: sel.aspectRatios || {
                        plainBg: "1:1",
                        bgReplace: "1:1",
                        model: "1:1",
                        campaign: "1:1",
                    },
                }
            })
            return fromCollection
        }

        const updateSelections = () => {
            if (productUploadPageRef?.current?.getSelections) {
                const currentSelections = productUploadPageRef.current.getSelections()
                if (currentSelections && Object.keys(currentSelections).length > 0) {
                    setSelections(currentSelections)
                    return
                }
            }
            const fromCollection = buildFromCollection()
            if (fromCollection) setSelections(fromCollection)
        }

        updateSelections()
        const interval = setInterval(updateSelections, 500)
        return () => clearInterval(interval)
    }, [productUploadPageRef, collectionData])

    const resolveImageTypeSelections = (productImages) => {
        let imageTypeSelections = null
        if (productUploadPageRef?.current?.getSelections) {
            const currentSelections = productUploadPageRef.current.getSelections()
            if (currentSelections && Object.keys(currentSelections).length > 0) {
                imageTypeSelections = currentSelections
            }
        }
        if (!imageTypeSelections && selections && Object.keys(selections).length > 0) {
            imageTypeSelections = selections
        }
        if (!imageTypeSelections && productImages?.length) {
            imageTypeSelections = {}
            productImages.forEach((product, index) => {
                const sel = product.generation_selections || {}
                imageTypeSelections[index] = {
                    plainBg: Boolean(sel.plainBg),
                    bgReplace: Boolean(sel.bgReplace),
                    model: Boolean(sel.model),
                    campaign: Boolean(sel.campaign),
                    plainBgColor: sel.plainBgColor || "#ffffff",
                    modelTiers: sel.modelTiers || {},
                    aspectRatios: sel.aspectRatios || {
                        plainBg: "1:1",
                        bgReplace: "1:1",
                        model: "1:1",
                        campaign: "1:1",
                    },
                }
            })
        }
        return imageTypeSelections
    }

    const handleGenerate = async () => {
        if (!collectionData?.id) {
            setIndication('No collection found yet. Open this project again and continue.')
            return
        }

        const productImages = collectionData?.items?.[0]?.product_images
        if (!productImages || productImages.length === 0) {
            setIndication('Upload product images first, then try generating.')
            return
        }

        const imageTypeSelections = resolveImageTypeSelections(productImages)
        const needsModel = selectionNeedsModel(imageTypeSelections)
        const hasProductOnly = selectionHasProductOnlyTypes(imageTypeSelections)

        if (needsModel && !selectedModel) {
            setIndication('Model and Campaign images need a model. Select one in the Models tab.')
            return
        }

        if (!selectedModel && !hasProductOnly) {
            setIndication('Select Plain BG or BG Replace, or pick a model in the Models tab.')
            return
        }

        setGenerating(true)
        setIsGenerating(true)
        setIndication(null)
        setSuccess(null)

        try {
            if (imageTypeSelections) {
                const hasAnySelection = Object.values(imageTypeSelections).some(sel => 
                    sel && typeof sel === 'object' && (sel.plainBg || sel.bgReplace || sel.model || sel.campaign)
                )
                if (!hasAnySelection) {
                    setIndication('Select at least one image type in Product Upload to continue.')
                    setGenerating(false)
                    setIsGenerating(false)
                    return
                }
            }

            let selectionsToSend = imageTypeSelections
            if (!selectedModel && imageTypeSelections) {
                selectionsToSend = {}
                Object.entries(imageTypeSelections).forEach(([key, sel]) => {
                    selectionsToSend[key] = {
                        ...sel,
                        model: false,
                        campaign: false,
                    }
                })
            }

            setOopsRetry(() => handleGenerate())

            const response = await apiService.generateProductModelImagesWithPolling(
                collectionData.id,
                selectionsToSend,
                token,
                (jobStatus) => {
                    if (jobStatus) {
                        setGenerationProgress({
                            current: jobStatus.completed_images || 0,
                            total: jobStatus.total_images || 0,
                        })
                    }
                }
            )

            if (response.success) {
                setSuccess(`Generated ${response.total_generated || 0} images successfully!`)
                if (onGenerate) {
                    await onGenerate({ imagesGenerated: true, jobId: response.job_id })
                }
                setTimeout(() => setSuccess(null), 5000)
            } else {
                notifyOopsError({ onRetry: () => handleGenerate() })
            }
        } catch (err) {
            console.error('Error generating images:', err)
            if (isAiServerDownError(err) || isOopsNotifiedError(err)) return
            notifyOopsError({ error: err, onRetry: () => handleGenerate() })
        } finally {
            setGenerating(false)
            setIsGenerating(false)
        }
    }

    const hasProducts = collectionData?.items?.[0]?.product_images?.length > 0
    const hasModelSelected = Boolean(selectedModel)

    const totalSelectedImages = useMemo(() => {
        if (!selections || Object.keys(selections).length === 0) return null
        
        let total = 0
        Object.values(selections).forEach(sel => {
            if (sel && typeof sel === 'object') {
                if (sel.plainBg) total++
                if (sel.bgReplace) total++
                if (hasModelSelected) {
                    if (sel.model) total++
                    if (sel.campaign) total++
                }
            }
        })
        return total > 0 ? total : null
    }, [selections, hasModelSelected])

    const canGenerateWithoutModel = useMemo(() => {
        if (!selections) return false
        return selectionHasProductOnlyTypes(selections)
    }, [selections])

    const generateEnabled =
        !generating &&
        hasProducts &&
        isOwner &&
        (hasModelSelected || canGenerateWithoutModel) &&
        !(totalSelectedImages !== null && totalSelectedImages === 0)

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between py-6 px-6 bg-card border border-border rounded-lg">
                <div>
                    <h3 className="font-semibold text-foreground mb-1">Generate Final Images</h3>
                    <p className="text-sm text-muted-foreground">
                        Combine products with AI models to create final images
                    </p>
                    {hasProducts && (hasModelSelected || canGenerateWithoutModel) && (
                        <p className="text-xs text-green-400 mt-1">
                            {totalSelectedImages !== null && totalSelectedImages > 0 ? (
                                <>✓ Ready to generate {totalSelectedImages} image{totalSelectedImages !== 1 ? 's' : ''} ({totalSelectedImages} credits required)</>
                            ) : (
                                <>Select image types in Product Upload to generate</>
                            )}
                        </p>
                    )}
                    {hasProducts && !hasModelSelected && canGenerateWithoutModel && (
                        <p className="text-xs text-muted-foreground mt-1">
                            Generating without a model — Plain BG and BG Replace only. Select a model in the Models tab for Model/Campaign images.
                        </p>
                    )}
                </div>
                <Button
                    onClick={handleGenerate}
                    disabled={!generateEnabled}
                    variant="brand"
                    className="gap-2"
                    title={
                        !isOwner ? "You need Owner role to generate images" :
                        (totalSelectedImages === 0 ? "Please select at least one image type in Product Upload" :
                        (!hasModelSelected && !canGenerateWithoutModel
                            ? "Select Plain BG / BG Replace, or go to the Models tab to select a model"
                            : ""))
                    }
                >
                    <Sparkles className="w-4 h-4" />
                    {generating ? 'Generating...' : 'Generate Product Images'}
                </Button>
            </div>

            <FieldIndication>{indication}</FieldIndication>

            {success && (
                <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <p className="text-green-400 text-sm">✓ {success}</p>
                </div>
            )}

            {generating && (
                <div className="mt-4 bg-gold-solid/10 border border-gold-muted rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gold-solid"></div>
                        <div className="flex-1">
                            <p className="text-gold-solid text-sm">
                                Generating images... This may take several minutes depending on the number of products.
                            </p>
                            {generationProgress && (
                                <p className="text-gold-solid/80 text-xs mt-1">
                                    Progress: {generationProgress.current} / {generationProgress.total}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {!hasProducts && !indication && (
                <FieldIndication>
                    Upload product images in the Product Upload step before generating.
                </FieldIndication>
            )}
        </div>
    )
}
