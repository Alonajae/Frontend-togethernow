import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Image, View, TouchableOpacity, Text, StyleSheet, Modal, ImageBackground } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { addPhoto, removePhoto } from '../reducers/user'

export default function ProfilePicture(props) {

//   const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const addImage = () => {
    setModalVisible(true)
  };

  const pickImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4,3],
        quality: 1,
      });
      console.log('image',JSON.stringify(_image));
      if (!_image.canceled) {
        dispatch(addPhoto(_image.assets[0].uri));
        console.log(user.picture);
        setModalVisible(false);
      }
      console.log(_image);
  };

  const deletePicture = () => {
    dispatch(removePhoto())
    setModalVisible(false)
  }

  return (
            <View style={styles.container}>
                {user.picture  && <Image source={{ uri: user.picture }} style={{ width: 200, height: 200 }} />}
                    <View style={styles.uploadBtnContainer}>
                        <TouchableOpacity onPress={addImage} style={styles.uploadBtn} >
                            <Text>{user.picture ? 'Edit' : 'Upload'} Image</Text>
                            <FontAwesome name="camera" size={20} color="9E15B8" />
                        </TouchableOpacity>
                    </View>
                    <Modal 
                        visible={modalVisible} 
                        animationType='slide'
                        transparent={true} >
                        <View style={{
                                height: '20%',
                                marginTop: 'auto',
                                backgroundColor:'',
                                }}>
                            <View>
                                <View style={styles.topModal}>
                                    <View>
                                        <Text style={{ fontSize: 25, color: "9E15B8"}}>Photo de profil</Text>
                                    </View>
                                    <View>
                                        <TouchableOpacity style={styles.trash} onPress={deletePicture}>
                                            <FontAwesome name="trash" size={25} color="FB8C7C" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.addPicture}>
                                    <View style={styles.btnTitle}>
                                        <View>
                                        <TouchableOpacity style={styles.modalIcon} onPress={props.camera}>
                                            <FontAwesome name="camera" size={25} color="9E15B8" />
                                        </TouchableOpacity>
                                        </View>
                                        <View>
                                            <Text style={{ fontSize:25, color: "9E15B8" }}>Caméra</Text>
                                        </View>
                                    </View>
                                    <View style={styles.btnTitle}>
                                        <View>
                                            <TouchableOpacity style={styles.modalIcon} onPress={pickImage}>
                                                {/* <FontAwesome name="image" size={35} color="9E15B8" /> */}
                                            </TouchableOpacity>
                                        </View>
                                   </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
            </View>
  );
}