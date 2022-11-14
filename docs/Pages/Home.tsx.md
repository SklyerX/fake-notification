# Home.tsx

We first import all the required packages

---

The only new thing in `Home.tsx` is usage of redux and scrollable sections

---

### Redux

💡 In order to get the value of the redux state from the redux store we need the following code

`const state = useSelector((state: RootState) => state.preset.value);`

Learn more about redux and redux toolkit here: https://redux-toolkit.js.org/tutorials/quick-start

##### Using Dispatcher

💡 to update values in the redux store we have to use the following code.

This block sets up access to the store `const dispatch = useDispatch();`

and to update a (for exmaple) string value we have to do the following: `onPress={() => dispatch("New String")}`

---

### Scrolling

💡 In order to make things scrollable in react-native you have to use `Flatlist` or `ScrollView`

In the example in `Home.tsx` we are using `ScrollView`

```tsx
<ScrollView>
    ...
</ScrollView>
// Or to make it scrollable on the horizontal axis we have to add this
<ScrollView horizontal={true}>
    ...
</ScrollView>
```
