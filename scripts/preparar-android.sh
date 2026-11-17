#!/usr/bin/env bash
# Roda no GitHub Actions depois de "cap add android".
set -e
APP=android/app/src/main

# 1) Sempre na horizontal
sed -i 's/<activity/<activity android:screenOrientation="sensorLandscape"/' "$APP/AndroidManifest.xml"

# 2) Tela cheia imersiva + tela sempre ligada
JAVA=$(find "$APP/java" -name MainActivity.java | head -n1)
PKG=$(grep -m1 '^package' "$JAVA")
cat > "$JAVA" <<JAVAEOF
$PKG

import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        imersivo();
    }
    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) imersivo();
    }
    private void imersivo() {
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_FULLSCREEN
            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }
}
JAVAEOF

# 3) Ícone do app (se algo falhar aqui, o app ainda compila com o ícone padrão)
cp -r android-res/* "$APP/res/" || true
echo "preparar-android: ok"
