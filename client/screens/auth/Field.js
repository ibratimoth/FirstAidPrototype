import React from 'react'
import { TextInput } from 'react-native'

const Field = (props) => {
  return (
    <TextInput {...props} style={{borderRadius: 100, color: '#345ea3', paddingHorizontal: 10, width: '80%', marginVertical: 10, fontSize: 18}}
    placeholderTextColor='#345ea3'
    >

    </TextInput>
  )
}

export default Field