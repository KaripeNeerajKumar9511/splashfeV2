"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { WorkflowSteps } from "@/components/project/workflow-steps"
import { BriefAndConcept } from "@/components/project/brief-and-concept"
import { ThemesAndBackgrounds } from "@/components/project/themes-and-backgrounds"
import { ColorPalette } from "@/components/project/color-palette"
import { GlobalInstructions } from "@/components/project/global-instructions"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ChevronLeft, Lock } from "lucide-react"
import { ModelSelectionSection } from "@/components/project/model-selection-section"
import { ProductUploadPage } from "@/components/project/product-upload-page"
import { ImageGrid } from "../Image-grid"
import { GenerateSection } from "../generate-section"
import { apiService } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { canEditProject, isProjectOwner } from "@/lib/permissions"
import { useImageGeneration } from "@/context/ImageGenerationContext"
import { dataCache, cacheKeys } from "@/lib/data-cache"

export function WorkflowTab({ project }) {
    // Ref to ProductUploadPage to access selections
    const productUploadPageRef = useRef(null)
    const [activeStep, setActiveStep] = useState(1)
    const [collectionData, setCollectionData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)
    const { token, user } = useAuth()
    const { isGenerating } = useImageGeneration()

    // Check if user can edit
    const canEdit = canEditProject(project, user)
    const userRole = project.userRole
    // Check if user is owner (for generate button in step 5)
    const isOwner = isProjectOwner(project, user)
    // State for sequential display logic
    const [suggestionsRequested, setSuggestionsRequested] = useState(false)

    // State to track which steps have been saved
    // Step 1 is always accessible, but not necessarily saved
    const [savedSteps, setSavedSteps] = useState(new Set())

    console.log("savedSteps", savedSteps)
    // State to hold current form data from BriefAndConcept
    const [briefFormData, setBriefFormData] = useState({
        description: "",
        targetAudience: "",
        campaignSeason: "",
        hasDescription: false
    })

    // State to hold current selections
    const [currentSelections, setCurrentSelections] = useState({
        themes: [],
        outfits: [],
        backgrounds: [],
        poses: [],
        locations: [],
        colors: [],
        pickedColors: [],
        colorInstructions: "",
        globalInstructions: ""
    })

    // State to hold uploaded images
    const [uploadedImages, setUploadedImages] = useState({
        themes: [],
        outfits: [],
        backgrounds: [],
        poses: [],
        locations: [],
        colors: []
    })

    // Moodboard image removals held until Save and Continue
    const [pendingImageRemovals, setPendingImageRemovals] = useState([])

    // State to hold selected model from ModelSelectionSection
    const [selectedModel, setSelectedModel] = useState(null)

    // Unsaved-changes guard (steps 1–4). Step 5 has no Save and Continue.
    const [isDirty, setIsDirty] = useState(false)
    const [showSaveRequiredDialog, setShowSaveRequiredDialog] = useState(false)
    const allowDirtyRef = useRef(false)

    // After step/data loads, ignore hydration callbacks briefly so Save stays inactive
    useEffect(() => {
        allowDirtyRef.current = false
        setIsDirty(false)
        const timer = setTimeout(() => {
            allowDirtyRef.current = true
        }, 500)
        return () => clearTimeout(timer)
    }, [activeStep, collectionData?.id])

    const markDirty = useCallback(() => {
        if (!allowDirtyRef.current || activeStep === 5 || !canEdit) return
        setIsDirty(true)
    }, [activeStep, canEdit])

    const clearDirty = useCallback(() => {
        setIsDirty(false)
    }, [])

    // Memoized callback for global instructions change
    const handleGlobalInstructionsChange = useCallback((instructions) => {
        setCurrentSelections(prev => ({ ...prev, globalInstructions: instructions }))
        markDirty()
    }, [markDirty])

    const handleImageRemoved = useCallback((removal) => {
        if (!removal) return
        setPendingImageRemovals((prev) => {
            if (removal.cloudUrl && prev.some((item) => item.cloudUrl === removal.cloudUrl)) {
                return prev
            }
            return [...prev, removal]
        })
        markDirty()
    }, [markDirty])

    const handleBriefFormDataChange = useCallback((data) => {
        setBriefFormData(data)
        markDirty()
    }, [markDirty])

    const handleMoodboardSelectionsChange = useCallback((selections) => {
        setCurrentSelections(prev => ({ ...prev, ...selections }))
        markDirty()
    }, [markDirty])

    const handleMoodboardImagesChange = useCallback((images) => {
        setUploadedImages(prev => ({ ...prev, ...images }))
        markDirty()
    }, [markDirty])

    const handleModelSelectionChange = useCallback((model) => {
        setSelectedModel(model)
        // Keep collectionData in sync so Product Upload enables/disables Model/Campaign immediately
        setCollectionData((prev) => {
            if (!prev?.items?.[0]) return prev
            const items = [...prev.items]
            items[0] = { ...items[0], selected_model: model || null }
            return { ...prev, items }
        })
        markDirty()
    }, [markDirty])

    // Handlers for sequential display logic
    const handleRequestSuggestions = async (description, targetAudience = null, campaignSeason = null) => {
        if (!project?.id) {
            setError('Project not found')
            return
        }

        // Only set suggestionsRequested if description is provided
        if (description && description.trim()) {
            setSuggestionsRequested(true)
        } else {
            setSuggestionsRequested(false)
        }

        setLoading(true)
        setError(null)
        setSuccessMessage(null)

        try {
            // Call the API to update collection (description is optional, will generate suggestions only if description is provided)
            const response = await apiService.updateCollectionDescription(
                project.id,
                description || "",
                null,
                targetAudience,
                campaignSeason
            )

            if (response.success && response.collection) {
                // Update the collection data
                setCollectionData(response.collection)

                if (description && description.trim()) {
                    setSuccessMessage('AI suggestions updated successfully!')
                } else {
                    setSuccessMessage('Project settings saved successfully!')
                }

                // Mark step 1 as saved only after successful save
                // Step 1 is saved when targetAudience and campaignSeason are saved (description is optional)
                // This will automatically unlock step 2 via isStepUnlocked
                setSavedSteps(prev => new Set([...prev, 1]))
                clearDirty()

                // Navigate to step 2 (Moodboard Setup)
                setActiveStep(2)

                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(null), 3000)
            } else {
                throw new Error(response.error || 'Failed to save project settings')
            }
        } catch (err) {
            console.error('Error saving project settings:', err)
            setError(err.message)
            setSuggestionsRequested(false)
        } finally {
            setLoading(false)
        }
    }

    // Fetch collection data when project changes - with caching to prevent duplicate fetches
    useEffect(() => {
        const fetchCollectionData = async () => {
            if (project?.collection?.id && token) {
                try {
                    setLoading(true)
                    
                    // Try cache first for instant display
                    const collectionCacheKey = cacheKeys.collection(project.collection.id);
                    const cached = dataCache.get(collectionCacheKey);
                    if (cached) {
                        setCollectionData(cached);
                        setLoading(false);
                    }
                    
                    // Fetch fresh data with caching
                    const data = await dataCache.getOrFetch(
                        collectionCacheKey,
                        () => apiService.getCollection(project.collection.id, token),
                        2 * 60 * 1000 // 2 minutes cache
                    )
                    setCollectionData(data)

                    // Initialize saved steps based on backend data
                    // Only add steps that are actually saved to the backend
                    const newSavedSteps = new Set()

                    // Check if step 1 is saved (has targetAudience and campaignSeason saved to backend)
                    // Step 2 unlocks ONLY when step 1 is fully saved to backend
                    // Description is optional - only targetAudience and campaignSeason are required
                    const hasDescription = data.description && data.description.trim()
                    const hasTargetAudience = data.target_audience !== undefined && data.target_audience !== null
                    const hasCampaignSeason = data.campaign_season !== undefined && data.campaign_season !== null
                    // Step 1 is saved if targetAudience and campaignSeason are provided (description is optional)
                    const step1Saved = hasTargetAudience && hasCampaignSeason

                    if (step1Saved) {
                        newSavedSteps.add(1) // Step 1 is saved - this will unlock step 2 via isStepUnlocked

                        // Check if we have suggestions already generated (only if description exists)
                        if (hasDescription && data.items && data.items.length > 0) {
                            const item = data.items[0]
                            const hasSuggestions = (
                                (item.suggested_themes && item.suggested_themes.length > 0) ||
                                (item.suggested_outfits && item.suggested_outfits.length > 0) ||
                                (item.suggested_backgrounds && item.suggested_backgrounds.length > 0) ||
                                (item.suggested_colors && item.suggested_colors.length > 0)
                            )
                            if (hasSuggestions) {
                                setSuggestionsRequested(true)
                            }
                        } else {
                            // No description means no suggestions
                            setSuggestionsRequested(false)
                        }
                    }

                    // Check if step 2 is saved (has selections saved to backend)
                    // Step 3 unlocks only when step 2 is fully saved
                    if (data.items && data.items.length > 0) {
                        const item = data.items[0]
                        const hasSelections = (
                            (item.selected_themes && item.selected_themes.length > 0) ||
                            (item.selected_outfits && item.selected_outfits.length > 0) ||
                            (item.selected_backgrounds && item.selected_backgrounds.length > 0) ||
                            (item.selected_colors && item.selected_colors.length > 0) ||
                            (item.selected_poses && item.selected_poses.length > 0) ||
                            (item.selected_locations && item.selected_locations.length > 0) ||
                            (item.uploaded_theme_images && item.uploaded_theme_images.length > 0) ||
                            (item.uploaded_outfit_images && item.uploaded_outfit_images.length > 0) ||
                            (item.uploaded_background_images && item.uploaded_background_images.length > 0) ||
                            (item.uploaded_pose_images && item.uploaded_pose_images.length > 0) ||
                            (item.uploaded_location_images && item.uploaded_location_images.length > 0) ||
                            (item.uploaded_color_images && item.uploaded_color_images.length > 0) ||
                            (item.global_instructions && item.global_instructions.trim())
                        )
                        if (hasSelections) {
                            newSavedSteps.add(2) // Step 2 is saved - this will unlock step 3 via isStepUnlocked
                        }
                    }

                    // Step 3 (Model) is optional — unlock Product Upload once Moodboard is done.
                    // Still track selected model when present.
                    if (data.items && data.items.length > 0) {
                        const item = data.items[0]
                        if (newSavedSteps.has(2)) {
                            newSavedSteps.add(3)
                        }
                        if (item.selected_model || (item.uploaded_models && item.uploaded_models.length > 0)) {
                            if (item.selected_model) {
                                setSelectedModel(item.selected_model)
                            }
                        }
                    }

                    // Check if step 4 is saved (has products saved to backend)
                    // Step 5 unlocks only when step 4 is fully saved
                    if (data.items && data.items.length > 0) {
                        const item = data.items[0]
                        if (item.product_images && item.product_images.length > 0) {
                            newSavedSteps.add(4) // Step 4 is saved - this will unlock step 5 via isStepUnlocked
                        }
                    }

                    setSavedSteps(newSavedSteps)
                } catch (err) {
                    // Don't set error for 401 (unauthorized) - user might be logging out
                    if (err.message && !err.message.includes('401')) {
                        console.error('Error fetching collection:', err)
                        setError(err.message)
                    }
                } finally {
                    setLoading(false)
                }
            }
        }

        fetchCollectionData()
    }, [project?.collection?.id, token])
    console.log("step steps : ", savedSteps)

    const handleStepSave = async (stepData) => {
        try {
            setLoading(true)
            setError(null)
            setSuccessMessage(null)

            switch (activeStep) {
                case 1:
                    // Brief & Concept step - save targetAudience and campaignSeason (description is optional)
                    // If description is provided, generate suggestions; otherwise, allow proceeding without suggestions
                    if (!briefFormData.targetAudience || !briefFormData.campaignSeason) {
                        setError('Please enter target audience and campaign season')
                        return
                    }

                    await handleRequestSuggestions(
                        briefFormData.description || "",
                        briefFormData.targetAudience || null,
                        briefFormData.campaignSeason || null
                    )
                    // handleRequestSuggestions already navigates to step 2, so we don't need to do it here
                    return
                case 2:
                    // Moodboard setup step - flush pending image deletes, then save selections + generate prompts
                    if (project?.id && collectionData?.id) {
                        for (const removal of pendingImageRemovals) {
                            try {
                                await apiService.removeWorkflowImage(
                                    project.id,
                                    collectionData.id,
                                    removal.imageId,
                                    removal.category,
                                    token,
                                    removal.cloudUrl
                                )
                            } catch (removeErr) {
                                console.error('Failed to remove moodboard image on save:', removeErr)
                            }
                        }
                        setPendingImageRemovals([])

                        const response = await apiService.updateCollectionSelections(
                            project.id,
                            collectionData.id,
                            currentSelections,
                            uploadedImages
                        )

                        if (response.success) {

                            setSuccessMessage(response.message || 'Selections saved and prompts generated successfully!')

                            // Mark step 2 as saved - this will automatically unlock step 3 via isStepUnlocked
                            setSavedSteps(prev => new Set([...prev, 2]))
                            clearDirty()

                            // Refresh collection data after saving
                            const updatedData = await apiService.getCollection(collectionData.id, token)
                            setCollectionData(updatedData)

                            // Clear success message after 3 seconds
                            setTimeout(() => setSuccessMessage(null), 3000)
                        }
                    }
                    break
                case 3:
                    // Model selection step - save the selected model to backend
                    if (selectedModel && collectionData?.id) {
                        try {
                            setLoading(true)
                            const response = await apiService.selectModel(
                                collectionData.id,
                                selectedModel.type,
                                selectedModel
                            )

                            if (response.success) {
                                // Mark step 3 as saved - this will automatically unlock step 4 via isStepUnlocked
                                setSavedSteps(prev => new Set([...prev, 3]))
                                clearDirty()
                                const updatedData = await apiService.getCollection(collectionData.id, token)
                                setCollectionData(updatedData)
                                setSuccessMessage('Model selected successfully!')
                                setTimeout(() => setSuccessMessage(null), 3000)
                            } else {
                                throw new Error(response.error || 'Failed to save model')
                            }
                        } catch (err) {
                            console.error('Error saving model:', err)
                            setError(err.message || 'Failed to save model')
                            throw err // Re-throw to prevent navigation
                        } finally {
                            setLoading(false)
                        }
                    } else if (stepData.modelsSaved && collectionData?.id) {
                        // Handle case when AI models are saved (from handleSaveAIModels)
                        setSavedSteps(prev => new Set([...prev, 3]))
                        clearDirty()
                        const updatedData = await apiService.getCollection(collectionData.id, token)
                        setCollectionData(updatedData)
                        setSuccessMessage('Models saved successfully!')
                        setTimeout(() => setSuccessMessage(null), 3000)
                    } else if (collectionData?.id) {
                        // No model selected (or user unselected) — clear backend selection and continue
                        try {
                            setLoading(true)
                            await apiService.selectModel(collectionData.id, null, null, { clear: true })
                            setSavedSteps(prev => new Set([...prev, 3]))
                            clearDirty()
                            const updatedData = await apiService.getCollection(collectionData.id, token)
                            setCollectionData(updatedData)
                            setSuccessMessage('Continued without a model')
                            setTimeout(() => setSuccessMessage(null), 3000)
                        } catch (err) {
                            console.error('Error clearing model selection:', err)
                            setSavedSteps(prev => new Set([...prev, 3]))
                            clearDirty()
                        } finally {
                            setLoading(false)
                        }
                    } else {
                        setSavedSteps(prev => new Set([...prev, 3]))
                        clearDirty()
                    }
                    break
                case 4:
                    // Product upload / delete already hits the API; generation selections still need Save and Continue
                    if ((stepData.productsUploaded || stepData.productsUpdated) && collectionData?.id) {
                        const updatedData = await apiService.getCollection(collectionData.id, token)
                        setCollectionData(updatedData)
                        setSuccessMessage(
                            stepData.productsUploaded
                                ? 'Products uploaded successfully!'
                                : 'Product updated successfully!'
                        )
                        setTimeout(() => setSuccessMessage(null), 3000)
                    }
                    break
                case 5:
                    // Image generation step - refresh data if images were generated
                    if (stepData.imagesGenerated && collectionData?.id) {
                        const updatedData = await apiService.getCollection(collectionData.id, token)
                        setCollectionData(updatedData)
                        setSuccessMessage('Images generated successfully!')
                        setTimeout(() => setSuccessMessage(null), 3000)
                    }
                    break
            }

            setError(null)
        } catch (err) {
            console.error('Error saving step:', err)
            setError(err.message || 'Failed to save')
        } finally {
            setLoading(false)
        }
    }

    const renderStepContent = () => {
        return (
            <>
                {/* Role-based access message */}
                {!canEdit && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4 flex items-center gap-3">
                        <Lock className="w-5 h-5 text-amber-400" />
                        <div>
                            <p className="text-amber-300 font-medium">View-Only Access</p>
                            <p className="text-amber-400/90 text-sm">
                                You have {userRole} access. Only Editors and Owners can make changes to this project.
                            </p>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-solid"></div>
                        <span className="ml-2 text-muted-foreground">Loading...</span>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                        <p className="text-red-400">Error: {error}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                        <p className="text-green-400">✓ {successMessage}</p>
                    </div>
                )}

                {!loading && renderStepComponents()}
            </>
        )
    }

    const renderStepComponents = () => {

        switch (activeStep) {
            case 1:
                // Brief & Concept tab
                return (
                    <BriefAndConcept
                        project={project}
                        collectionData={collectionData}
                        onSave={handleStepSave}
                        onRequestSuggestions={handleRequestSuggestions}
                        suggestionsRequested={suggestionsRequested}
                        canEdit={canEdit}
                        onFormDataChange={handleBriefFormDataChange}
                    />
                )
            case 2:
                // Moodboard Setup tab
                // Only show suggestions if description was provided (suggestionsRequested is true)
                const hasDescription = collectionData?.description && collectionData.description.trim()
                const shouldShowSuggestions = suggestionsRequested && hasDescription

                return (
                    <>
                        <ThemesAndBackgrounds
                            project={project}
                            collectionData={collectionData}
                            onSave={handleStepSave}
                            showSuggestions={shouldShowSuggestions}
                            onSelectionsChange={handleMoodboardSelectionsChange}
                            onImagesChange={handleMoodboardImagesChange}
                            onImageRemoved={handleImageRemoved}
                            pendingRemovals={pendingImageRemovals}
                            canEdit={canEdit}
                        />
                        <ColorPalette
                            project={project}
                            collectionData={collectionData}
                            onSave={handleStepSave}
                            showSuggestions={shouldShowSuggestions}
                            onSelectionsChange={handleMoodboardSelectionsChange}
                            onImagesChange={handleMoodboardImagesChange}
                            onImageRemoved={handleImageRemoved}
                            pendingRemovals={pendingImageRemovals}
                            canEdit={canEdit}
                        />

                        <GlobalInstructions
                            project={project}
                            collectionData={collectionData}
                            onSave={handleStepSave}
                            canEdit={canEdit}
                            onInstructionsChange={handleGlobalInstructionsChange}
                        />
                    </>
                )
            case 3:
                // Model Selection tab
                return (
                    <ModelSelectionSection
                        project={project}
                        collectionData={collectionData}
                        onSave={handleStepSave}
                        canEdit={canEdit}
                        onModelSelectionChange={handleModelSelectionChange}
                    />
                )
            case 4:
                // Products Upload tab
                return (
                    <ProductUploadPage
                        ref={productUploadPageRef}
                        project={project}
                        collectionData={collectionData}
                        onSave={handleStepSave}
                        canEdit={canEdit}
                        onDirtyChange={markDirty}
                    />
                )
            case 5:
                // Generate and Edit tab
                return (
                    <>
                        <GenerateSection
                            project={project}
                            collectionData={collectionData}
                            onGenerate={handleStepSave}
                            canEdit={canEdit}
                            isOwner={isOwner}
                            productUploadPageRef={productUploadPageRef}
                        />
                        <ImageGrid
                            project={project}
                            collectionData={collectionData}
                            onDataRefresh={(updatedData) => setCollectionData(updatedData)}
                            canEdit={canEdit}
                        />
                    </>
                )
            default:
                return null
        }
    }

    // Function to check if a step is unlocked
    const isStepUnlocked = (stepNumber) => {
        if (stepNumber === 1) return true // Step 1 is always accessible
        // Model step (3) is optional: Product Upload (4) unlocks after Moodboard (2)
        if (stepNumber === 4) {
            return savedSteps.has(2) || savedSteps.has(3)
        }
        // A step is unlocked if the previous step is saved
        return savedSteps.has(stepNumber - 1)
    }

    // Block next/previous/step clicks when unsaved changes exist (steps 1–4)
    const requestStepChange = (stepNumber) => {
        if (isGenerating || loading) return
        if (stepNumber === activeStep) return
        if (!isStepUnlocked(stepNumber)) return

        const saveRequired = activeStep !== 5 && isDirty
        if (saveRequired) {
            setShowSaveRequiredDialog(true)
            return
        }
        // Skipping Model step via Next marks it complete so Product Upload stays unlocked
        if (activeStep === 3 && stepNumber > 3) {
            setSavedSteps(prev => new Set([...prev, 3]))
        }
        setActiveStep(stepNumber)
    }

    const handleStepClick = (stepNumber) => {
        requestStepChange(stepNumber)
    }

    const handleSaveAndContinue = async () => {
        if (isGenerating || activeStep === 5) return
        if (!isDirty) return
        try {
            setError(null)
            await handleStepSave({})
            if (activeStep === 1) {
                // Step 1 navigates inside handleRequestSuggestions
                return
            }
            if (activeStep === 3 && collectionData?.id) {
                try {
                    const updatedData = await apiService.getCollection(collectionData.id, token)
                    setCollectionData(updatedData)
                    setSavedSteps(prev => new Set([...prev, 3]))
                    clearDirty()
                    setActiveStep(4)
                    return
                } catch (err) {
                    console.error('Error checking step 3:', err)
                    setSavedSteps(prev => new Set([...prev, 3]))
                    clearDirty()
                    setActiveStep(4)
                    return
                }
            }
            if (activeStep === 4 && collectionData?.id) {
                try {
                    if (productUploadPageRef?.current?.hasPendingUploads?.()) {
                        setError('Please upload your selected product images before continuing')
                        return
                    }
                    if (productUploadPageRef?.current?.saveSelections) {
                        const saveResult = await productUploadPageRef.current.saveSelections()
                        if (!saveResult.success) {
                            setError(saveResult.error || 'Failed to save generation selections')
                            return
                        }
                    }

                    const updatedData = await apiService.getCollection(collectionData.id, token)
                    setCollectionData(updatedData)
                    const item = updatedData.items?.[0]
                    const hasProducts = item?.product_images && item.product_images.length > 0
                    if (hasProducts) {
                        setSavedSteps(prev => new Set([...prev, 4]))
                        clearDirty()
                        setActiveStep(5)
                        return
                    }
                } catch (err) {
                    console.error('Error checking step 4:', err)
                    setError('Failed to save generation selections')
                    return
                }
            }
            clearDirty()
            const nextStep = Math.min(activeStep + 1, 5)
            if (isStepUnlocked(nextStep) || savedSteps.has(activeStep)) {
                setActiveStep(nextStep)
            }
        } catch (err) {
            console.error('Error in Save and Continue:', err)
        }
    }

    return (
        <div className="space-y-8">
            <WorkflowSteps
                activeStep={activeStep}
                setActiveStep={handleStepClick}
                savedSteps={savedSteps}
                isStepUnlocked={isStepUnlocked}
                isGenerating={isGenerating}
                setSavedSteps={setSavedSteps}
            />

            {renderStepContent()}

            <div className="flex items-center justify-between pt-8 border-t border-border ">
                <Button
                    variant="outline"
                    className="gap-2 bg-transparent text-gold-solid"
                    onClick={() => requestStepChange(Math.max(activeStep - 1, 1))}
                    disabled={loading || isGenerating || activeStep === 1}
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </Button>

                {activeStep !== 5 ? (
                    <Button
                        className="bg-gold-gradient hover:brightness-110 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSaveAndContinue}
                        disabled={loading || !canEdit || isGenerating || !isDirty}
                        title={
                            isGenerating
                                ? "Image generation in progress..."
                                : !canEdit
                                    ? "You need Editor or Owner role to save changes"
                                    : !isDirty
                                        ? "No changes to save"
                                        : "Save your changes and continue"
                        }
                    >
                        {loading ? (activeStep === 1 ? 'Generating Suggestions...' : 'Saving...') : 'Save and Continue'}
                    </Button>
                ) : (
                    <div className="px-8" />
                )}

                <Button
                    variant="outline"
                    className="text-gold-solid"
                    onClick={() => requestStepChange(Math.min(activeStep + 1, 5))}
                    disabled={loading || !isStepUnlocked(Math.min(activeStep + 1, 5)) || isGenerating || activeStep === 5}
                    title={
                        isGenerating
                            ? "Image generation in progress..."
                            : isDirty && activeStep !== 5
                                ? "Save your changes before going to the next step"
                                : (!isStepUnlocked(Math.min(activeStep + 1, 5))
                                    ? "Complete the current step to unlock the next step"
                                    : "")
                    }
                >
                    Next
                </Button>
            </div>

            <Dialog open={showSaveRequiredDialog} onOpenChange={setShowSaveRequiredDialog}>
                <DialogContent className="sm:max-w-md border-border bg-card">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Save required</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            You have unsaved changes on this step. Please click{" "}
                            <span className="text-gold-solid font-medium">Save and Continue</span>{" "}
                            before moving to another step.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            className="bg-gold-gradient hover:brightness-110 text-white"
                            onClick={() => setShowSaveRequiredDialog(false)}
                        >
                            OK
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
