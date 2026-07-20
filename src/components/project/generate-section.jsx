import { useState, useEffect, useMemo } from "react"
import { Sparkles, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiService } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { useImageGeneration } from "@/context/ImageGenerationContext"

function getUserFriendlyError(error) {
    if (!error) return "Something went wrong. Please try again."
    if (error.response) {
        const status = error.response.status
        const msg = error.response.data?.error || error.response.data?.message
        if (msg && typeof msg === "string" && msg.length < 300) return msg
        switch (status) {
            case 400: return "Something seems incorrect. Please check your selection and try again."
            case 401: return "Your session has expired. Please log in again."
            case 403: return "You don't have permission to perform this action."
            case 404: return "The requested item was not found."
            case 429: return "Too many requests. Please wait a moment and try again."
            case 500: return "Something went wrong on our side. Please try again in a few moments."
            default: return "An unexpected error occurred. Please try again."
        }
    }
    if (error.request) return "Network issue. Please check your connection and try again."
    return error.message || "Something went wrong. Please try again."
}

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
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [selectedModel, setSelectedModel] = useState(null)
    const [generationProgress, setGenerationProgress] = useState(null) // { current: 1, total: 3 }
    const [selections, setSelections] = useState(null)
    const { token } = useAuth()
    const { setIsGenerating } = useImageGeneration()
    
    // Get the selected model from backend (empty {} is not a selection)
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

    // Load selections (including aspect ratios) from saved product data and/or live ProductUploadPage
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
            setError('No collection found')
            return
        }

        const productImages = collectionData?.items?.[0]?.product_images
        if (!productImages || productImages.length === 0) {
            setError('Please upload product images first')
            return
        }

        const imageTypeSelections = resolveImageTypeSelections(productImages)
        const needsModel = selectionNeedsModel(imageTypeSelections)
        const hasProductOnly = selectionHasProductOnlyTypes(imageTypeSelections)

        if (needsModel && !selectedModel) {
            setError('Model Image and Campaign Image require a model. Please go to the Models tab and select a model.')
            return
        }

        if (!selectedModel && !hasProductOnly) {
            setError('Select Plain BG or BG Replace to generate without a model, or go to the Models tab to select a model.')
            return
        }

        setGenerating(true)
        setIsGenerating(true)
        setError(null)
        setSuccess(null)

        try {
            if (imageTypeSelections) {
                const hasAnySelection = Object.values(imageTypeSelections).some(sel => 
                    sel && typeof sel === 'object' && (sel.plainBg || sel.bgReplace || sel.model || sel.campaign)
                )
                if (!hasAnySelection) {
                    setError('Please select at least one image type to generate in Product Upload')
                    setGenerating(false)
                    setIsGenerating(false)
                    return
                }
            }

            // Without a model, only send product-only types
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

            const response = await apiService.generateProductModelImagesWithPolling(
                collectionData.id,
                selectionsToSend,
                token,
                (jobStatus) => {
                    // jobStatus from /api/jobs/{job_id}/images/
                    if (jobStatus) {
                        setGenerationProgress({
                            current: jobStatus.completed_images || 0,
                            total: jobStatus.total_images || 0,
                        })
                        console.log('Generation progress:', jobStatus.status, jobStatus.completed_images, '/', jobStatus.total_images)
                    }
                }
            )

            if (response.success) {
                setSuccess(`Generated ${response.total_generated || 0} images successfully!`)
                if (onGenerate) {
                    // Notify parent so it can refresh collection data from backend
                    await onGenerate({ imagesGenerated: true, jobId: response.job_id })
                }
                setTimeout(() => setSuccess(null), 5000)
            } else {
                setError(response.error || 'Failed to generate images')
            }
        } catch (err) {
            console.error('Error generating images:', err)
            setError(getUserFriendlyError(err) || err?.message || 'Failed to generate images')
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
                                <>⚠️ Select image types in Product Upload to generate</>
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

            {error && (
                <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}

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
                                <p className="text-muted-foreground text-xs mt-1">
                                    Processing product {generationProgress.current} of {generationProgress.total}...
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {!hasProducts && !error && (
                <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                    <p className="text-amber-300 text-sm">
                        ⚠️ Please upload product images in Product Upload
                    </p>
                </div>
            )}
        </div>
    )
}
