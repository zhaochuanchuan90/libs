
import React, { Component } from 'react';
import { StyleSheet, View, Text, Modal, TouchableWithoutFeedback } from 'react-native';

export default class ModalBox extends Component{
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    }
  }
  render() {
    return (
      <Modal
        visible={this.state.visible}
        transparent={true}
        onRequestClose={() => this.hide()}
      >
        <View style={[styles.wrapper, styles.center]}>
          <View style={[styles.box, styles.center, { backgroundColor: this.props.color }]}>
            <Text style={[styles.txt, { color: 'white' }]}>公共组件弹窗 </Text>
            <TouchableWithoutFeedback onPress={() => this.hide()}>
              <View style={[styles.btnWrapper, styles.center, { marginTop: 30, }]}>
                <Text style={styles.txt}>关闭弹窗</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>
    )
  }

  show = () => {
    this.setState({
      visible: true,
    })
  }

  hide = () => {
    this.setState({
      visible: false,
    })
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  box: {
    width: 300,
    height: 300,
    // backgroundColor: '#ed738d',
    backgroundColor: 'red',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnWrapper: {
    width: 100,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  txt: {
    fontSize: 16,
    color: 'black',
  }
})