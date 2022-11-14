# App.tsx

We first get started by importing all of the packages for navigations and wrappers and screens.

To create a stack navigator we can simply use the function that
💡 comes with the `@react-navigation/stack` module

🔥 The useEffect is self explanitory, as all we are doing is to see if a preset exists in the async storage and if it does not so we can create it if there is none.

---

💡 We wrap our whole application in 3 wrappers
The first one `<Provider store={store}>...</Provider>`

- This is redux's provider so we can access all of the states.

💡 The second one `<NativeBaseProvider>...</NativeBaseProvider>`

- The wrapper for the UI library known as https://nativebase.io

💡 The third one `<NavigationContainer>...</NavigationContainer>`

- This is the wrapepr for reactnavigation's controlling

---

🔥 The rest are some components to help us define our screen types
Such as `Navigator.Screen` to define a screen `Navigator.Group` to define a group of screens with a different presentaion such as `card` or `modal`.
