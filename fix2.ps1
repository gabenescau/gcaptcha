$page2 = Get-Content -Path "page2/index.html" -Raw -Encoding UTF8
$page2Str = $page2.Replace("R$ 47,81", "R$ 29,81")
$page2Str = $page2Str.Replace("R$ 1.883,59", "R$ 1.865,59")
Set-Content -Path "page2/index.html" -Value $page2Str -Encoding UTF8

$agora = Get-Content -Path "agoranovo.html" -Encoding UTF8
$top = $agora[0..245] -join "`n"
$bottom = $agora[575..($agora.Count - 1)] -join "`n"

$agoraNew = $top + "`n`t`t`t`t`t" + $page2Str + "`n`t`t`t`t</div>`n" + $bottom
Set-Content -Path "agoranovo.html" -Value $agoraNew -Encoding UTF8

Write-Host "Fixed successfully!"
