import React from 'react';
import { View, Text, FlatList } from 'react-native';

const BuddiesList = ({ buddies }) => {
    return (
        <View>
        <Text>Buddies nearby :</Text>
        <FlatList
            data={buddies}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <Text>{item.firstname}</Text>}
        />
        </View>
    );
    }

export default BuddiesList;