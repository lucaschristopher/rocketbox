import React, {Component} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import socket from 'socket.io-client';

import api from '../../services/api';

import styles from './styles';

export default class Box extends Component {
  state = {box: {}};

  async componentDidMount() {
    const box = await AsyncStorage.getItem('@RocketBox:box');

    this.subscribeToNewFiles(box);

    const response = await api.get(`boxes/${box}`);

    this.setState({box: response.data});
  }

  subscribeToNewFiles = (box) => {
    const io = socket('http://localhost:3355');

    io.emit('connectRoom', box);

    io.on('file', (data) => {
      this.setState({
        box: {...this.state.box, files: [data, ...this.state.box.files]},
      });
    });
  };

  handleUpload = () => {
    ImagePicker.launchImageLibrary({}, async (upload) => {
      if (upload.error) {
        console.log('Deu ruim!');
      } else if (upload.didCancel) {
        console.log('Cancelou!');
      } else {
        const data = new FormData();

        const [prefix, suffix] = upload.fileName.split('.');
        const ext = suffix.toLocaleLowerCase() === 'heic' ? 'jpg' : suffix;

        data.append('file', {
          uri: upload.uri,
          type: upload.type,
          name: `${prefix}.${ext}`,
        });

        api.post(`boxes/${this.state.box._id}/files`, data);
      }
    });
  };

  openFile = async (file) => {
    try {
      const filePath = `${RNFS.DocumentDirectoryPath}/${file.title}`;
      await RNFS.downloadFile({
        fromUrl: file.url,
        toFile: filePath,
      });

      await FileViewer.open(filePath);
    } catch (error) {
      console.log('arquivo nao suportado');
    }
  };

  renderItem = ({item}) => (
    <TouchableOpacity style={styles.file} onPress={() => this.openFile(item)}>
      <View style={styles.fileInfo}>
        <Icon name="perm-media" size={24} color="#a5cfff" />
        <Text style={styles.fileTitle}>{item.title}</Text>
      </View>
      <Text style={styles.fileDate}>Criado em: {item.createdAt}</Text>
    </TouchableOpacity>
  );

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.boxTitle}>{this.state.box.title}</Text>

        <FlatList
          style={styles.list}
          data={this.state.box.files}
          keyExtractor={(file) => file._id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={this.renderItem}
        />

        <TouchableOpacity style={styles.fab} onPress={this.handleUpload}>
          <Icon name="backup" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }
}
