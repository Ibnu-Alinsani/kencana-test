import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Button,
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
} from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [noHandphone, setNoHandphone] = useState("");

  // state validity
  const [validityEmail, setValidityEmail] = useState();
  const [validityNoHandphone, setValidityNoHandphone] = useState();
  const [validityPassword, setValidityPassword] = useState();

  // state date
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Cek Validitas email
  function checkValidityEmail(email) {
    const regexp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (regexp.test(email)) {
      setValidityEmail(true);
    } else {
      setValidityEmail(false);
    }
  }

  // Cek Validitas Password
  function checkValidityPassword(password) {
    const regexp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (regexp.test(password)) {
      setValidityPassword(true);
    } else {
      setValidityPassword(false);
    }
  }

  // Cek No. Handphone
  function checkNumber(number) {
    const regexp = /^\d{11,13}$/;
    if (regexp.test(number)) {
      setValidityNoHandphone(true);
    } else {
      setValidityNoHandphone(false);
    }
  }

  function formatDate(date) {
    let d = new Date(date);
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    return day + "-" + month + "-" + year;
  }

  function toggleDatePicker() {
    setShowPicker(!showPicker);
  }

  function onChangeDatePicker({ type }, selectedDate) {
    if (type === "set") {
      const currentDate = selectedDate;
      setDate(currentDate);

      if (Platform.OS === "android") {
        toggleDatePicker();
        setDateOfBirth(formatDate(currentDate));
      }
    } else {
      toggleDatePicker();
    }
  }

  async function handleSubmit() {
    // validasi nilai
    if (email.trim() === "" && !validityEmail)
      return alert("Email tidak boleh kosong atau email tidak valid");
    if (password.trim() === "" && !validityPassword)
      return alert(
        "Password tidak boleh kosong atau password tidak memenuhi syarat"
      );
    if (noHandphone.trim() === "" && !validityNoHandphone)
      return alert(
        "No. Handphone tidak boleh kosong atau no. handphone tidak valid"
      );
    if (dateOfBirth.trim() === "")
      return alert("Tanggal Lahir tidak boleh kosong");
    const body = JSON.stringify({
      email,
      password,
      noHandphone,
      dateOfBirth,
    });

    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    };
    const url = "https://contoh/api/user";
    try {
      const response = fetch(url, config);
      const result = await response.json();
      console.log("Success : ", result);
    } catch (error) {
      console.error("Error : ", error);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <TextInput
        style={[
          styles.input,
          email !== "" ? !validityEmail && styles.input_wrong : null,
        ]}
        placeholder="Masukkan Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          checkValidityEmail(text);
        }}
      />
      {email !== "" ? !validityEmail && <Text> Email tidak valid </Text> : null}
      <TextInput
        style={[
          styles.input,
          password !== "" ? !validityPassword && styles.input_wrong : null,
        ]}
        placeholder="Masukkan Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          checkValidityPassword(text);
        }}
      />
      {password !== ""
        ? !validityPassword && (
            <Text>
              {" "}
              Password setidaknya harus berisi huruf besar, huruf kecil dan
              simbol (@$!%*?&)
            </Text>
          )
        : null}
      <TextInput
        style={[
          styles.input,
          noHandphone !== ""
            ? !validityNoHandphone && styles.input_wrong
            : null,
        ]}
        placeholder="Masukkan No. Handphone"
        keyboardType="number-pad"
        value={noHandphone}
        onChangeText={(text) => {
          setNoHandphone(text);
          checkNumber(text);
        }}
      />
      {noHandphone !== "" ? !validityNoHandphone && <Text> No. Handphone tidak valid,setidaknya harus berisi 8 angka dan tidak lebih dari 13 angka </Text> : null}

      <View>
        {showPicker && (
          <RNDateTimePicker
            mode="date"
            value={date}
            display="spinner"
            onChange={onChangeDatePicker}
          />
        )}
        <Pressable onPressIn={toggleDatePicker}>
          <TextInput
            style={styles.input}
            placeholder="Masukkan Tanggal Lahir"
            value={dateOfBirth}
            editable={false}
          />
        </Pressable>
      </View>

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: 200,
  },
  input_wrong: {
    borderColor: "red",
  },
});
