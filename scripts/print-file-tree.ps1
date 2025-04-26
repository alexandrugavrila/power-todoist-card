# Ensure script runs from the Git root
$gitRoot = git rev-parse --show-toplevel 2>$null
if (-not $gitRoot) {
    Write-Error "Not a git repository. Aborting."
    exit 1
}

Set-Location $gitRoot

# Get all files not ignored by Git
$allFiles = git ls-files --others --cached --exclude-standard

# Build a nested tree structure
$tree = @{}
foreach ($file in $allFiles) {
    $parts = $file -split '[\\/]' # Normalize path separators
    $cursor = $tree
    foreach ($part in $parts) {
        if (-not $cursor.ContainsKey($part)) {
            $cursor[$part] = @{}
        }
        $cursor = $cursor[$part]
    }
}

# StringBuilder to hold output for clipboard
$sb = [System.Text.StringBuilder]::new()

function Show-Tree {
    param (
        [hashtable]$Node,
        [string]$Indent = ""
    )

    foreach ($key in $Node.Keys | Sort-Object) {
        $isLeaf = $Node[$key].Count -eq 0
        $symbol = if ($isLeaf) { "📄" } else { "📁" }
        $line = "$Indent$symbol $key"
        Write-Host $line
        $null = $sb.AppendLine($line)
        if (-not $isLeaf) {
            Show-Tree -Node $Node[$key] -Indent "$Indent    "
        }
    }
}

# Display and capture tree
Show-Tree -Node $tree

# Copy to clipboard
$sb.ToString() | Set-Clipboard
Write-Host "`n✅ Tree structure copied to clipboard!"
