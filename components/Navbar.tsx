import {
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconFontAwesome from "react-native-vector-icons/FontAwesome5";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { changeState } from "../redux/navbarSlice";

const navItems = [
  {
    id: 1,
    name: "All Presets",
    state: "all",
  },
  {
    id: 2,
    name: "Primary Presets",
    state: "primary",
  },
  {
    id: 3,
    name: "General Presets",
    state: "general",
  },
];

export default function Navbar({ navigation }: any) {
  const [menuStatus, setMenuStatus] = useState<boolean>(false);

  const state = useSelector((value: RootState) => value.preset.value);

  const dispatch = useDispatch();

  return (
    <View style={[styles.container, styles.margin]}>
      <SafeAreaView>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 27,
              fontWeight: "bold",
              marginLeft: 10,
              marginTop: 5,
            }}
          >
            Notifications
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setMenuStatus(!menuStatus)}
          >
            <IconEntypo
              name="dots-three-vertical"
              color="#fff"
              size={24}
              style={{ marginRight: 5 }}
            />
          </TouchableOpacity>
        </View>
        {menuStatus && (
          <View style={styles.menu}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.menuItem}
              onPress={() => {
                setMenuStatus(false);
                navigation.navigate("Add / Send", {
                  state: "Add",
                });
              }}
            >
              <IconEntypo name="plus" color="#fff" size={24} />
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 16,
                  marginLeft: 10,
                }}
              >
                Add New Preset
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.menuItem}
              onPress={() => {
                setMenuStatus(false);
                navigation.navigate("Add / Send", {
                  state: "Send",
                });
              }}
            >
              <IconFontAwesome name="pen-fancy" color="#fff" size={24} />
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 16,
                  marginLeft: 10,
                }}
              >
                Send a notification
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 15,
          borderBottomWidth: 2,
          paddingBottom: 15,
          borderColor: "#293343",
          zIndex: -1,
        }}
      >
        {navItems.map((item) => (
          <View key={item.name}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => dispatch(changeState(`${item.state}`))}
            >
              <View
                style={{
                  backgroundColor: state == item.state ? "#fff" : "#589BFF",
                  padding: 8,
                  borderRadius: 5,
                  marginLeft: 4,
                }}
              >
                <Text
                  style={{
                    color: state == item.state ? "#589BFF" : "#fff",
                    fontWeight: "bold",
                  }}
                >
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121921",
  },
  margin: {
    paddingTop: Platform.OS === "ios" ? 0 : 50,
  },
  menu: {
    width: 200,
    height: 75,
    borderRadius: 5,
    backgroundColor: "#1B2531",
    position: "absolute",
    top: 105,
    right: 5,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 5,
    zIndex: 20,
  },
  menuItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginLeft: 5,
  },
  input: {
    marginTop: 15,
    borderRadius: 15,
    height: 30,
    padding: 5,
    width: "96%",
    alignSelf: "center",
    color: "#ADADAD",
    zIndex: -1,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 100,
  },
});
