import { View, Text, Button } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const SignUp = () => {
  return (
    <View>
      <Text>SignUp</Text>
        <Button title="sign-in" onPress={() => router.push("/(auth)/sign-in")} />
    </View>
  )
}

export default SignUp