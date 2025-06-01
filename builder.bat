@echo off
rd /S /Q output
mkdir output
cd behavior_packs
mkdir GVCBedrockWTeam
mkdir GVCBedrockWii
xcopy /Y /E .\GVCBedrock .\GVCBedrockWTeam
xcopy /Y /E .\GVCBedrock .\GVCBedrockWii
xcopy /Y /E .\GVCBedrockTeam .\GVCBedrockWTeam
xcopy /Y /E .\GVCBedrock\manifest.json .\GVCBedrockWTeam\manifest.json
cd ..
cd resource_packs
mkdir GVCBedrockW
xcopy /Y /E .\GVCBedrock .\GVCBedrockW
cd ..
python python/builder.py
"C:\Program Files\7-Zip\7z.exe" a -tzip ./output/GVCBedrockAddonBTeam.zip .\behavior_packs\GVCBedrockWTeam
"C:\Program Files\7-Zip\7z.exe" a -tzip ./output/GVCBedrockAddonB.zip .\behavior_packs\GVCBedrockWii
"C:\Program Files\7-Zip\7z.exe" a -tzip ./output/GVCBedrockAddonR.zip .\resource_packs\GVCBedrockW
rename output\GVCBedrockAddonBTeam.zip GVCBedrockAddonBTeam.mcaddon
rename output\GVCBedrockAddonB.zip GVCBedrockAddonB.mcpack
rename output\GVCBedrockAddonR.zip GVCBedrockAddonR.mcpack
rd /S /Q behavior_packs\GVCBedrockWTeam
rd /S /Q behavior_packs\GVCBedrockWii
rd /S /Q resource_packs\GVCBedrockW
del output\GVCBedrockAddonBTeam.zip
del output\GVCBedrockAddonB.zip
del output\GVCBedrockAddonR.zip
echo Addon files have been built and renamed successfully.
pause