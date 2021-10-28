import React from 'react';

import {
  Text,
  View,
} from 'react-native';

export default function StatusRenderer ({ statusList }) {

    return (
        <View >
            {
                statusList.map( (itm, key) => {
                    return (
                        <Text key={key+itm.label} style={{margin: 5, fontSize:16, fontWeight:'bold'}}>{itm.label}: {itm.value}</Text>
                    )
                })
            }
        </View>
    )
}