import { defineConfig, loadEnv, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import commonjs from "vite-plugin-commonjs";
import obfuscator from "vite-plugin-javascript-obfuscator";
import fs from "fs";
import path from "path";

function htaccessPlugin(baseUrl = "/"): Plugin {
  if (!baseUrl.endsWith("/")) {
    baseUrl += "/";
  }
  return {
    name: "generate-htaccess",
    apply: "build",
    closeBundle() {
      const htaccessContent = `
SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase ${baseUrl}
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . ${baseUrl}index.html [L]

  RewriteCond %{HTTP:X-Forwarded-Proto} !https
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
# Extra Security Headers
<IfModule mod_headers.c>
	Header set X-XSS-Protection "1; mode=block"
	Header always append X-Frame-Options SAMEORIGIN
	Header set X-Content-Type-Options nosniff
  Header set Strict-Transport-Security "max-age=31536000" env=HTTPS
  Header set Cache-Control "no-store"
  Header set Pragma "no-cache"
</IfModule>
#Turn Off sserver signature
ServerSignature Off
      `.trim();

      const outputPath = path.resolve(__dirname, "dist/.htaccess");
      fs.writeFileSync(outputPath, htaccessContent, "utf8");
      console.log("✅ .htaccess file generated at dist/.htaccess");
    },
  };
}

export default defineConfig(({ mode }) => {
  console.log("MODE", mode);
  const env = loadEnv(mode, process.cwd(), "");

  const plugins = [commonjs(), react()];

  if (mode != "development") {
    plugins.push(
      obfuscator({
        options: {
          compact: true,
          controlFlowFlattening: true,
          deadCodeInjection: true,
          debugProtection: false,
          disableConsoleOutput: true,
          identifierNamesGenerator: "hexadecimal",
          rotateStringArray: true,
          selfDefending: true,
          stringArray: true,
          stringArrayEncoding: ["rc4"],
          stringArrayThreshold: 0.75,
          transformObjectKeys: true,
          unicodeEscapeSequence: false,
        },
      })
    );
  }

  plugins.push(htaccessPlugin(env.BASE_URL));

  return {
    plugins,
    base: env.BASE_URL,
    build: {
      commonjsOptions: { transformMixedEsModules: true },
      minify: "terser",
      rollupOptions: {
        onwarn: () => {
          // Suppress all warnings to prevent build failures
          return;
        },
      },
    },
    esbuild: {
      // Disable TypeScript build errors
      logOverride: {
        "this-is-undefined-in-esm": "silent",
        "empty-import-meta": "silent",
      },
    },
    logLevel: mode === "production" ? "error" : "info",
  };
});