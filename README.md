# 実行
- nodeバージョン: 22.20.0 (lts)

```bash
npm i -g yarn
yarn set version stable
yarn add
npx expo prebuild
```

- ここで一旦ネイティブコードをいじる必要がある
- 生成された`android/app/src/main/AndroidManifest.xml`の`<manifest>`内に以下を追記

```xml
  <application>
    <meta-data
      android:name="com.google.android.geo.API_KEY"
      android:value="[GCPから取ってきたAPIキー]"
    />
  </application>
```

- ビルド & 実行

```bash
npx expo run:android
```

- 以降はこのコマンドで実行する(`npx expo start` は使わない)
