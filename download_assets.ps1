$baseUrl = "https://agoranovo.site"
$assets = @(
    "/wp-content/themes/twentytwentyfive/style.css?ver=1.3",
    "/wp-content/plugins/elementor/assets/css/frontend.min.css?ver=3.33.4",
    "/wp-content/uploads/elementor/css/post-5.css?ver=1765936817",
    "/wp-content/uploads/elementor/css/post-1176.css?ver=1771836506",
    "/wp-content/uploads/elementor/google-fonts/css/roboto.css?ver=1754622220",
    "/wp-content/uploads/elementor/google-fonts/css/robotoslab.css?ver=1754622282",
    "/wp-includes/js/jquery/jquery.min.js?ver=3.7.1",
    "/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1",
    "/wp-includes/js/jquery/ui/core.min.js?ver=1.13.3",
    "/wp-content/plugins/elementor/assets/js/webpack.runtime.min.js?ver=3.33.4",
    "/wp-content/plugins/elementor/assets/js/frontend-modules.min.js?ver=3.33.4",
    "/wp-content/plugins/elementor/assets/js/frontend.min.js?ver=3.33.4",
    "/wp-content/themes/twentytwentyfive/assets/fonts/manrope/Manrope-VariableFont_wght.woff2",
    "/wp-content/themes/twentytwentyfive/assets/fonts/fira-code/FiraCode-VariableFont_wght.woff2"
)

foreach ($asset in $assets) {
    # Extract path without query string for folder creation and saving
    $assetPath = $asset.Split('?')[0]
    $relativePath = $assetPath.TrimStart('/')
    $dirName = Split-Path $relativePath -Parent
    
    if (!(Test-Path $dirName)) {
        New-Item -ItemType Directory -Force -Path $dirName | Out-Null
    }
    
    $url = $baseUrl + $asset
    Write-Host "Downloading $url to $relativePath"
    try {
        curl.exe -sL $url -o $relativePath
    } catch {
        Write-Host "Failed to download $url"
    }
}

# Now rewrite index.html
$htmlContent = Get-Content -Raw index.html
$htmlContent = $htmlContent -replace 'https://agoranovo.site/wp-', 'wp-'
Set-Content index.html $htmlContent
Write-Host "Replaced links in index.html"
