# Deploy to Windows `C:\dev\nhigia-web-demo`

This executor subagent could not run Shell with `machineId` (schema not exposed). Copy sources from the box artifact, then:

```powershell
$node24 = "C:\Users\Admin\AppData\Local\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.18.0-win-x64"
$env:Path = "$node24;" + $env:Path
New-Item -ItemType Directory -Force -Path C:\dev\nhigia-web-demo | Out-Null
# Extract / sync project files into C:\dev\nhigia-web-demo
cd C:\dev\nhigia-web-demo
npm install
npm run dev
```

Dev URL: http://localhost:3020

Box artifact (already verified): `/workspace/nhigia-web-demo` and `/workspace/nhigia-web-demo.tar.gz`
