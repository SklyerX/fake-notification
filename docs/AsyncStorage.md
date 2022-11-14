# Async Storage

To download async storage while using expo execute `@react-native-async-storage/async-storage`

To import the package do `import AsyncStorage from "@react-native-async-storage/async-storage";`

---

### Getting Values

💡 To get values or set values we need to create async functions to await the actions

💡 In order to access values stored in async storage you need to add this code block in an async function

```tsx
const foo = async () => {
  let items: any = await AsyncStorage.getItem("@presets")!;
  let parsed = JSON.parse(items);

  console.log(items.Bar);
};
```

The reason we need to parse it as json is because the value gets stored as a json stringify which makes it unaccessable.

---

### Setting Values

💡 In order to set values in async storage you need to add this code block in an async function

```tsx
const foo = async () => {
  let value =
    /* ARRAY */ /* OBJECT */ /* STRING */ /* NUMBER */
    await AsyncStorage.setItem("@presets", JSON.stringify(value))!;
};
```

🔥 You need to stringify the values so the async storage can easly save it and access it later.
