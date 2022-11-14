# App.tsx

We first import all the required packages

---

💡 To create a notification handler we must install `expo-notifications` and to create it we need the following code:

```ts
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
```

This sets up the basics of a notification handler but you can go more in depth by looking here https://docs.expo.dev/versions/latest/sdk/notifications/

💡 To get the route params in react native we have to pass it in through the props and grab it using the following block: `const { state } = route.params;`

---

🔥 We are using react hooks to store the variables we get from the user, packages, and async storage

🔥 We are creating a function to handle the submittion of the notification but the most important part is

```ts
await Notifications.scheduleNotificationAsync({
  content: {
    title: title,
    body: text,
    data: { data: "goes here" },
    badge: 1,
    autoDismiss: true,
  },
  trigger: { seconds: 5 },
});
```

💡 In order send notification(s) we must get access from the user and store their expo token in async storage.

To do that we need to add this code block

```ts
const getPermission = async () => {
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Enable push notifications to use the app!");
      await AsyncStorage.setItem("expopushtoken", "");
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    await AsyncStorage.setItem("expopushtoken", token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
};
```

We are checking the `Contasts.isDevice` from `expo-constants`.
The overall purpose of this code block is to see if the user has notification permissions activated or not. if not we will ask them to accept notifications. If they deny it we store their token as an empty value, else we are going to get their token from the accepted prompt and then store their token. In addition we are making sure that the user is not using an emmulator and we are also customizing our notification on an android phone (feature is only for andriod).

---

The rest is just react code to get information from the user and save them in states just like any other react webapp
