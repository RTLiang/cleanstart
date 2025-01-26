# Read version from manifest.json
$manifest = Get-Content -Path .\manifest.json -Raw | ConvertFrom-Json
$version = $manifest.version

# Get parent folder name
$parentFolder = Split-Path (Get-Location) -Leaf
$zipFileName = "${parentFolder}_v${version}.zip"
$tempDir = New-Item -ItemType Directory -Path "TempPublish"

javascript-obfuscator .\script.js --output $tempDir.FullName\script.js `
    --control-flow-flattening true `
    --dead-code-injection true `
    --self-defending true `
    --disable-console-output true `
    --string-array-encoding rc4 `
    --transform-object-keys true `
    --unicode-escape-sequence true `
    --debug-protection true

# 压缩HTML
html-minifier .\index.html `
    --collapse-whitespace `
    --remove-comments `
    --remove-optional-tags `
    --remove-redundant-attributes `
    --remove-script-type-attributes `
    --remove-tag-whitespace `
    --use-short-doctype `
    --minify-css true `
    --minify-js true `
    --output "$($tempDir.FullName)\index.html"

try {
    # Copy files while maintaining structure and excluding specified items
    Get-ChildItem -Path . -Recurse | Where-Object {
        $fullPath = $_.FullName
        -not $fullPath.Contains("\.git") -and
        -not $fullPath.Contains("\docs") -and
        -not $fullPath.Contains("\TempPublish") -and
        $_.Name -notin @("changelog.md", "readme.md", "compress.ps1",".gitignore","script.js","index.html")
    } | ForEach-Object {
        $targetPath = $_.FullName.Replace((Get-Location).Path, $tempDir.FullName)
        if (-not (Test-Path (Split-Path $targetPath -Parent))) {
            New-Item -ItemType Directory -Path (Split-Path $targetPath -Parent) | Out-Null
        }
        if (-not $_.PSIsContainer) {
            Copy-Item $_.FullName -Destination $targetPath
        }
    }

    # Compress the temporary directory
    Compress-Archive -Path "$($tempDir.FullName)\*" -DestinationPath $zipFileName -CompressionLevel Optimal

    # Move the zip file to parent directory
    $parentPath = (Get-Location).Path | Split-Path -Parent
    Move-Item -Path $zipFileName -Destination $parentPath -Force
}
finally {
    Remove-Item $tempDir -Recurse -Force
}

Write-Host "Package created: $parentPath\$zipFileName"