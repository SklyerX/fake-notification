import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CheckIcon,
  Input,
  Select,
  useToast,
  Toast,
  TextArea,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Modal({ route, navigation }: any) {
  const { state } = route.params;
  const [image, setImage] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [service, setService] = React.useState<string>("");
  const [text, onChangeText] = React.useState<string>("");
  const [title, setTitle] = React.useState<string>("");
  const [success, setSuccess] = React.useState<boolean>(false);

  const [asyncStorageList, setAsyncStorageList]: any = React.useState([]);
  const [notification, setNotification] = useState<boolean>(false);

  const toast = useToast();
  const toastIdRef = React.useRef();
  const notificationListener: any = React.useRef();
  const responseListener: any = React.useRef();

  const schedulePushNotification = async () => {
    toastIdRef.current = toast.show({
      title: "Notification pending...",
      variant: "solid",
      description: "Notification will appear in 5 seconds.",
      backgroundColor: "#0daf0d",
    });

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
  };

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

  useEffect(() => {
    if (
      state === "Add" &&
      image.length !== 0 &&
      name.length !== 0 &&
      service.length !== 0
    ) {
      setSuccess(true);
    }
    if (state === "Send" && text.length !== 0 && service.length !== 0) {
      setSuccess(true);
    }
  }, [image, name, service, text]);

  useEffect(() => {
    setTitle(service);
  }, [service]);

  useEffect(() => {
    const getItems = async () => {
      let items: any = await AsyncStorage.getItem("@presets")!;
      const parsed = JSON.parse(items);

      setAsyncStorageList(parsed);
    };
    getItems();
    getPermission();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(Boolean(!notification));
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const manageAdditionToLocalStorage = async () => {
    const objectToPush = {
      image,
      name,
      service,
    };

    if (asyncStorageList.find((x: any) => x.name === name)) {
      return (toastIdRef.current = toast.show({
        title: "Preset Exists!",
        variant: "solid",
        description: "A preset with this name already exists!",
        backgroundColor: "#f00",
      }));
    }

    asyncStorageList.push(objectToPush);

    await AsyncStorage.setItem("@presets", JSON.stringify(asyncStorageList));

    toastIdRef.current = toast.show({
      title: "Preset Created!",
      variant: "solid",
      description: "Success a new preset has been created!",
      backgroundColor: "#07D307",
    });

    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      {state == "Add" && (
        <View style={styles.margin}>
          <SafeAreaView>
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                marginLeft: 20,
                fontSize: 22,
              }}
            >
              Add A New Preset
            </Text>
            <Box alignItems="center">
              <View>
                <Text style={{ color: "#fff", marginTop: 30, marginBottom: 5 }}>
                  Preset Image
                </Text>
                <Input
                  onChangeText={setImage}
                  placeholder="Add image url"
                  spellCheck={false}
                  w="80"
                  style={{ backgroundColor: "#1B2531", color: "#fff" }}
                />
              </View>
              <View>
                <Text style={{ color: "#fff", marginTop: 30, marginBottom: 5 }}>
                  Preset name
                </Text>
                <Input
                  onChangeText={setName}
                  placeholder="Select a preset name"
                  w="80"
                  style={{ backgroundColor: "#1B2531", color: "#fff" }}
                />
              </View>
              <View>
                <Text style={{ color: "#fff", marginTop: 30, marginBottom: 5 }}>
                  State
                </Text>
                <Select
                  selectedValue={service}
                  w="80"
                  accessibilityLabel="Choose Service"
                  placeholder="Choose Service"
                  color="#fff"
                  bgColor="#1B2531"
                  _selectedItem={{
                    backgroundColor: "#07816a",
                    color: "#1B2531",
                    borderRadius: 5,
                  }}
                  backgroundColor="#f00"
                  onValueChange={(itemValue) => setService(itemValue)}
                  style={{ backgroundColor: "#1B2531" }}
                >
                  <Select.Item label="Primary Preset" value="pp" />
                  <Select.Item label="General Preset" value="gp" />
                </Select>
              </View>
              <Button
                disabled={!success}
                style={{
                  backgroundColor: success ? "#293343" : "#1d2430",
                  marginTop: 20,
                }}
                w="80"
                onPress={manageAdditionToLocalStorage}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: success ? "#fff" : "#999",
                  }}
                >
                  Submit
                </Text>
              </Button>
            </Box>
          </SafeAreaView>
        </View>
      )}
      {state == "Send" && (
        <View style={styles.margin}>
          {asyncStorageList.length !== 0 ? (
            <>
              <SafeAreaView>
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    marginLeft: 25,
                    fontSize: 22,
                  }}
                >
                  Send A Notification!
                </Text>
                <Box alignItems="center">
                  <View>
                    <Text
                      style={{ color: "#fff", marginTop: 30, marginBottom: 5 }}
                    >
                      Select a Preset
                    </Text>
                    <Select
                      selectedValue={service}
                      w="80"
                      accessibilityLabel="Choose Service"
                      placeholder="Choose Service"
                      color="#fff"
                      bgColor="#1B2531"
                      _selectedItem={{
                        backgroundColor: "#07816a",
                        color: "#1B2531",
                        borderRadius: 5,
                      }}
                      backgroundColor="#f00"
                      onValueChange={(itemValue) => setService(itemValue)}
                      style={{ backgroundColor: "#1B2531" }}
                    >
                      {asyncStorageList.map((item: any) => (
                        <Select.Item
                          label={`${item.name}`}
                          value={`${item.name.toLowerCase()}`}
                        />
                      ))}
                    </Select>
                  </View>
                  <View>
                    <Text
                      style={{ color: "#fff", marginTop: 25, marginBottom: 5 }}
                    >
                      Notification Message
                    </Text>
                    <Input
                      color="#fff"
                      bgColor="#1B2531"
                      backgroundColor="#07816a"
                      borderRadius={5}
                      placeholder="Hello! You have been summoned for an advertisment message!"
                      w="80"
                      style={{ backgroundColor: "#1B2531" }}
                      maxLength={70}
                      onChangeText={onChangeText}
                      value={text}
                    />
                  </View>
                  {/* <View>
                    <Text
                      style={{ color: "#fff", marginTop: 25, marginBottom: 5 }}
                    >
                      Notification Title
                    </Text>
                    <Input
                      color="#fff"
                      bgColor="#1B2531"
                      backgroundColor="#07816a"
                      borderRadius={5}
                      placeholder="Andrew Tate's House"
                      w="80"
                      style={{ backgroundColor: "#1B2531" }}
                      maxLength={70}
                      onChangeText={setTitle}
                      value={title}
                    />
                  </View> */}
                  <Button
                    disabled={!success}
                    style={{
                      backgroundColor: success ? "#293343" : "#1d2430",
                      marginTop: 20,
                    }}
                    w="80"
                    onPress={schedulePushNotification}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: success ? "#fff" : "#999",
                      }}
                    >
                      Submit
                    </Text>
                  </Button>
                </Box>
              </SafeAreaView>
            </>
          ) : (
            <Text>Please create a preset first!</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121921",
  },
  margin: {
    paddingTop: 20,
  },
});
