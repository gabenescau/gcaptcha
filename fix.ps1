$page2 = Get-Content -Path "page2/index.html" -Raw -Encoding UTF8
$agora = Get-Content -Path "agoranovo.html" -Raw -Encoding UTF8

$startPattern = "            <!-- MATH EXPLANATION -->"
$endPatternPage2 = "            // Check for previous visit"
$endPatternAgora = "            // Check for previous visit"

$startIdxPage2 = $page2.IndexOf($startPattern)
$endIdxPage2 = $page2.IndexOf($endPatternPage2)
$chunk = $page2.Substring($startIdxPage2, $endIdxPage2 - $startIdxPage2)

$startIdxAgora = $agora.IndexOf($startPattern)
$endIdxAgora = $agora.IndexOf($endPatternAgora)

$agoraFixed = $agora.Substring(0, $startIdxAgora) + $chunk + $agora.Substring($endIdxAgora)

# Replace values in both files
$oldValues = @("R$ 47,81", "R$ 1.883,59", "R$ 77,00", "R$ 1.912,78")
$agoraFixed = $agoraFixed.Replace("R$ 77,00", "R$ 29,81")
$agoraFixed = $agoraFixed.Replace("R$ 1.912,78", "R$ 1.865,59")
$agoraFixed = $agoraFixed.Replace("R$ 47,81", "R$ 29,81")
$agoraFixed = $agoraFixed.Replace("R$ 1.883,59", "R$ 1.865,59")

$page2Fixed = $page2.Replace("R$ 47,81", "R$ 29,81")
$page2Fixed = $page2Fixed.Replace("R$ 1.883,59", "R$ 1.865,59")

Set-Content -Path "agoranovo.html" -Value $agoraFixed -Encoding UTF8
Set-Content -Path "page2/index.html" -Value $page2Fixed -Encoding UTF8

Write-Host "Fixed!"
