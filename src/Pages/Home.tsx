import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Navbar from "../../components/Navbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/AntDesign";
import { AlertDialog, Button } from "native-base";

interface PresetData {
  image: string;
  name: string;
  service: string;
}

export default function Home({ navigation }: any) {
  const state = useSelector((state: RootState) => state.preset.value);
  const dispatch = useDispatch();

  const [data, setData]: any = useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [deleteName, setDeleteName] = React.useState<string>("");

  const onClose = () => setIsOpen(false);

  const cancelRef = React.useRef(null);

  useEffect(() => {
    setData([]);
    const fetchSavedPresets = async () => {
      const item: any = await AsyncStorage.getItem("@presets");
      if (item.length > 0) {
        const itme = JSON.parse(item);

        setData(itme.reverse());
      }
    };

    const fetchPrimaryPresets = async () => {
      const item: any = await AsyncStorage.getItem("@presets");

      if (item.length > 0) {
        const json = JSON.parse(item);
        const filtered = json.filter((x: any) => x.service === "pp");

        setData(filtered.reverse());
      }
    };

    const fetchGeneralPresets = async () => {
      const item: any = await AsyncStorage.getItem("@presets");

      if (item.length > 0) {
        const json = JSON.parse(item);
        const filtered = json.filter((x: any) => x.service === "gp");

        setData(filtered.reverse());
      }
    };

    if (state == "all") {
      fetchSavedPresets();
    }
    if (state == "primary") {
      fetchPrimaryPresets();
    }
    if (state == "general") {
      fetchGeneralPresets();
    }
  }, [state]);

  const handleDelete = async () => {
    setIsOpen(false);

    const array: any = await AsyncStorage.getItem("@presets");

    const JsonMade = JSON.parse(array);

    const filtered = JsonMade.filter((x: PresetData) => x.name !== deleteName);

    await AsyncStorage.setItem("@presets", JSON.stringify(filtered));

    handleRefresh();
  };

  const handleRefresh = async () => {
    if (state == "all") {
      const item: any = await AsyncStorage.getItem("@presets");
      if (item.length > 0) {
        const itme = JSON.parse(item);

        setData(itme.reverse());
      }
    }
    if (state == "primary") {
      const item: any = await AsyncStorage.getItem("@presets");
      if (item.length > 0) {
        const filteredArray = item.filter((x: any) => x.service === "pp");
        const itme = JSON.parse(filteredArray);

        setData(itme.reverse());
      }
    }
    if (state == "general") {
      const item: any = await AsyncStorage.getItem("@presets");
      if (item.length > 0) {
        const filteredArray = item.filter((x: any) => x.service !== "gp");
        const itme = JSON.parse(filteredArray);

        setData(itme.reverse());
      }
    }
  };

  return (
    <View style={styles.container}>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>
            <Text>Delete Preset</Text>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <Text>
              This will remove the currnet preset! please note that this action
              is irreversible.
            </Text>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}
              >
                Cancel
              </Button>
              <Button colorScheme="danger" onPress={handleDelete}>
                Delete
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
      <Navbar navigation={navigation} />
      <Text
        style={{
          marginLeft: 15,
          marginTop: 15,
          color: "#5A6375",
          fontSize: 20,
        }}
      >
        Recent
      </Text>
      <ScrollView style={{ marginTop: 15 }}>
        {data.map((item: PresetData, key: any) => (
          <TouchableOpacity
            activeOpacity={0.9}
            key={key}
            style={{
              marginLeft: 15,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
            onLongPress={() => {
              setIsOpen(!isOpen);
              setDeleteName(item.name);
            }}
            onPress={() =>
              navigation.navigate("Edit Preset", {
                preset: {
                  Name: item.name,
                  Image: item.image,
                  Service: item.service,
                  IndexOf: data
                    .reverse()
                    .findIndex((x: PresetData) => x.name === item.name),
                },
              })
            }
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: 10,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                {item.name}
              </Text>
              <Text style={{ color: "#8492AA" }}>
                {item.service == "gp" ? "General Preset" : "Primary Preset"}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity activeOpacity={0.9} onPress={handleRefresh}>
        <View style={styles.button}>
          <Icon name="reload1" color="#fff" size={20} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121921",
    position: "relative",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#293343",
    position: "absolute",
    bottom: 25,
    right: 20,
    padding: 15,
    borderRadius: 1000,
  },
});
