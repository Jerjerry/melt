import JSZip from 'jszip';
import { MASTER_ANDROID_CODEBASE } from '../data/mockHardwareData';

export async function exportGeminiBoxZip(): Promise<void> {
  const zip = new JSZip();

  // Root manifests and docs
  zip.file('README.md', `# 🐰 Project Bx: Rabbit R1 Gemini Box Master OS
A stripped-down, battery-efficient single-app Android Kiosk OS replacing Rabbit OS with Google Gemini Live, Spark Micro-Apps, and Ad-Free YouTube Music.
Hardware: MediaTek MT6765, 2.88" 480x640 Display, Rotating MS35774 Stepper Camera, Rotary Wheel, Side PTT Button.

## Quick Flash Instructions:
1. Unlock Rabbit R1 bootloader via fastboot.
2. Connect USB with ADB debugging enabled.
3. Run \`bash scripts/Install_Bx_OS.sh\` (Linux/macOS) or \`scripts\\Install_Bx_OS.bat\` (Windows).
4. Reboot into Gemini Box Kiosk!
`);

  zip.file('ARCHITECTURE.md', MASTER_ANDROID_CODEBASE['ARCHITECTURE.md'].content);
  zip.file('ANTIGRAVITY_PROMPT.md', `Project: Gemini Box (Project Bx) for Rabbit R1 Hardware
Target Hardware: MediaTek MT6765, 4GB RAM, 2.88" 480x640 Touch Display (Density 180), Rotating MS35774 Stepper Camera, Rotary Scroll Wheel, Side PTT Button.
Target OS: Android 13/15 GSI configured as Single-App Kiosk.
`);

  // Scripts folder
  const scripts = zip.folder('scripts');
  if (scripts) {
    scripts.file('Install_Bx_OS.sh', MASTER_ANDROID_CODEBASE['Install_Bx_OS.sh'].content);
    scripts.file('Install_Bx_OS.bat', `@echo off\r\necho Provisioning Rabbit R1 with Gemini Box OS...\r\nadb wait-for-device\r\nadb shell wm size 480x640\r\nadb shell wm density 180\r\nadb install -r app\\build\\outputs\\apk\\debug\\app-debug.apk\r\nadb shell cmd package set-home-activity com.r1.geminikiosk/.MainActivity\r\nadb reboot\r\n`);
  }

  // App folder
  const appSrc = zip.folder('app/src/main/java/com/r1/geminikiosk');
  if (appSrc) {
    appSrc.file('MainActivity.kt', MASTER_ANDROID_CODEBASE['MainActivity.kt'].content);
    appSrc.file('BxLiveStream.kt', MASTER_ANDROID_CODEBASE['BxLiveStream.kt'].content);
    appSrc.file('BxMusicEngine.kt', MASTER_ANDROID_CODEBASE['BxMusicEngine.kt'].content);
    appSrc.file('CameraMotorManager.kt', MASTER_ANDROID_CODEBASE['CameraMotorManager.kt'].content);
  }

  // AndroidManifest.xml
  const res = zip.folder('app/src/main');
  if (res) {
    res.file('AndroidManifest.xml', `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.r1.geminikiosk">

    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Gemini Box"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait"
            android:launchMode="singleTask">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.HOME" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ProjectBx_GeminiBox_RabbitR1_Master.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
