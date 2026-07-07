/**
 * Normalize a regeneration API response so image path fields stay in sync.
 * GeneratedSmartImage prefers generated_image_path over generated_image_url,
 * so stale paths must be replaced when a new image is created.
 */
export function normalizeRegenerationResponse(response) {
    if (!response) return response;

    const path =
        response.generated_image_path ||
        response.local ||
        response.local_path ||
        response.generated_image_url ||
        "";

    const url = response.generated_image_url || path;

    return {
        ...response,
        success: response.success !== false,
        generated_image_url: url,
        generated_image_path: path,
        local: response.local || path,
        local_path: response.local || response.local_path || path,
    };
}

/** Merge regeneration result into an existing displayed image object. */
export function mergeRegenerationResult(previousImage, response) {
    const normalized = normalizeRegenerationResponse(response);

    return {
        ...previousImage,
        generated_image_url: normalized.generated_image_url,
        generated_image_path: normalized.generated_image_path,
        local: normalized.local,
        local_path: normalized.local_path,
        mongo_id: normalized.mongo_id ?? previousImage?.mongo_id,
        prompt: normalized.combined_prompt || normalized.prompt || previousImage?.prompt,
        dimension: normalized.dimension || previousImage?.dimension,
    };
}
