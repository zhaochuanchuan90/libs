/**
 * 选择时间组件
 */
import React, { Component, PropTypes } from 'react'
import { View, StyleSheet, TouchableWithoutFeedback, Animated, Text, Keyboard } from 'react-native'
import Picker from '../react-native-roll-picker';
const AnimatedList = Animated.createAnimatedComponent(View);
import Dimensions from 'Dimensions';
const { height } = Dimensions.get('window');
import {styleConsts} from '../../apps/utils/styleSheet/styles';
import Toast from 'react-native-root-toast';
import { toastShort } from '../toastShort';
import { hoursData, minutesData } from './config'

export default class SelectTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nowHeight: new Animated.Value(0),
      height: 0,
      opticty: new Animated.Value(0),
      start: true,
      minutesStart: 0,
      hoursStart: 0,
      minutesEnd: 0,
      hoursEnd: 0,
    };
  }
  componentDidMount() {
    const { startTime, endTime } = this.props;
    let minutesStart = 0;
    let hoursStart = 0;
    let minutesEnd = 0;
    let hoursEnd = 0;
    if(startTime &&  '' !== startTime){
      let startTimeD = this.returnIndex(startTime.split(":"));
      minutesStart = -1 === startTimeD[1] ? 0 : startTimeD[1];
      hoursStart = -1 === startTimeD[0] ? 0 : startTimeD[0];
    }
    if(endTime &&  '' !== endTime){
      let endTimeD = this.returnIndex(endTime.split(":"))
      minutesEnd = -1 === endTimeD[1] ? 0 : endTimeD[1];
      hoursEnd = -1 === endTimeD[0] ? 0 : endTimeD[0];
    }
    this.setState({
      minutesStart,
      hoursStart,
      minutesEnd,
      hoursEnd,
    });
  }
  componentWillReceiveProps(nextProps) {
    const { startTime, endTime } = nextProps;
    let minutesStart = 0;
    let hoursStart = 0;
    let minutesEnd = 0;
    let hoursEnd = 0;
    if(startTime &&  '' !== startTime){
      let nwstartTime = startTime.indexOf(':')>-1 ? startTime.split(":") : startTime.split("：")
      let startTimeD = this.returnIndex(nwstartTime);
      minutesStart = -1 === startTimeD[1] ? 0 : startTimeD[1];
      hoursStart = -1 === startTimeD[0] ? 0 : startTimeD[0];
    }
    if(endTime &&  '' !== endTime){
      let nwendTimeD = endTime.indexOf(':')>-1 ? endTime.split(":") : endTime.split("：")
      let endTimeD = this.returnIndex(nwendTimeD)
      minutesEnd = -1 === endTimeD[1] ? 0 : endTimeD[1];
      hoursEnd = -1 === endTimeD[0] ? 0 : endTimeD[0];
    }
    this.setState({
      minutesStart,
      hoursStart,
      minutesEnd,
      hoursEnd,
    });
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }
  render() {
    const {hoursStart, minutesStart, hoursEnd, minutesEnd, start} = this.state;
    return (
      <View style={[styles.popSelect, { height: this.state.height }]} >
        <TouchableWithoutFeedback onPress={() => this.hide()}>
            <AnimatedList style={[styles.optictyBg,{opacity: this.state.opticty}]} />
        </TouchableWithoutFeedback>

        <AnimatedList style={[styles.selectCenter, { height: this.state.nowHeight }]}>
          <View style={styles.defaultTimeBox}>
            <View style={styles.defaultTime}>
              <TouchableWithoutFeedback onPress={() => this.changeTimeType()}>
                <View style={[styles.time, this.state.start && { borderColor: this.props.color }]}>
                  <Text style={styles.title}>开业：</Text>
                  <Text style={styles.timeInfo}>
                    {`${hoursData[hoursStart].name}:${minutesData[minutesStart].name}`}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <View style={styles.middelLine} />
              <TouchableWithoutFeedback onPress={() => this.changeTimeType()}>
                <View style={[styles.time, !this.state.start && { borderColor: this.props.color }]}>
                  <Text style={styles.title}>结业：</Text>
                  <Text style={styles.timeInfo}>
                    {`${hoursData[hoursEnd].name}:${minutesData[minutesEnd].name}`}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.btnBox}>
              <TouchableWithoutFeedback onPress={() => this.hide()}>
                <View style={styles.btn}>
                  <Text style={styles.btnInfo}>取消</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => this.confirm()}>
                <View style={styles.btn}>
                  <Text style={styles.btnInfo}>确认</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>

          <View style={styles.pickBox}>
            <View style={styles.picOne}>
              <Picker
                data={hoursData}
                name={'name'}
                ref='hoursPicker'
                unit='h'
                selectTo={ start ? hoursStart : hoursEnd}
                onRowChange={(index) => { this.setTime(index, true) }}
              />
            </View>
            <View style={[styles.picOne, {marginLeft: 10}]}>
              <Picker
                data={minutesData}
                name={'name'}
                ref='minutesPicker'
                unit='m'
                selectTo={ start ? minutesStart : minutesEnd}
                onRowChange={(index) => { this.setTime(index) }}
              />
            </View>
          </View>
        </AnimatedList>
      </View>
    )
  }

  show = (hideBack) => {
    this.hideBack = hideBack;
    Keyboard.dismiss();
    this.setState({
      height,
    })
    Animated.parallel([
      Animated.timing(
        this.state.opticty,
        {
          toValue: 0.4,
          duration: 150,
        }
      ).start(),
      Animated.timing(
        this.state.nowHeight,
        {
          toValue: 232,
          duration: 200,
        }
      ).start()
    ])
  }

  hide = () => {
    this.hideBack instanceof Function && this.hideBack();
    Animated.parallel([
      Animated.timing(
        this.state.opticty,
        {
          toValue: 0,
          duration: 150,
        }
      ).start(),
      Animated.timing(
        this.state.nowHeight,
        {
          toValue: 0,
          duration: 200,
        }
      ).start()
    ])
    this.timer = setTimeout(() => {
      this.setState({height: 0})
    }, 200)
  }

  returnIndex = (time) => {
    let resH = hoursData.findIndex((hours) => { // 找到默认的小时位置
      return (hours.name - 0) - (time[0]-0) == 0
    })
    let resM = minutesData.findIndex((minutes) => { // 找到默认的分钟的位置
      return (minutes.name - 0) - (time[1] - 0) == 0
    })
    return [resH, resM]
  }

  changeTimeType = () => {
    this.setState({
      start: !this.state.start,
    })
    this.refs.hoursPicker.setDataSource(hoursData);
    this.refs.minutesPicker.setDataSource(minutesData);
  }

  setTime = (index, flag) => {
    index = -1 === index ? 0: index
    if (flag) { // 小时
      if (this.state.start) {
        this.setState({
          hoursStart: index,
        })
      } else {
        this.setState({
          hoursEnd: index,
        })
      }
    } else {
      if(this.state.start){
        this.setState({
          minutesStart: index,
        })
      } else {
        this.setState({
          minutesEnd: index,
        })
      }
    }
  }

  confirm = () => {
    const {hoursStart, minutesStart, hoursEnd, minutesEnd} = this.state;
    // 验证
    this.toast && Toast.hide(this.toast)
    if(hoursEnd > hoursStart || (hoursEnd === hoursStart && minutesEnd > minutesStart)){
      this.props.confirm(`${hoursData[hoursStart].name}:${minutesData[minutesStart].name}`,`${hoursData[hoursEnd].name}:${minutesData[minutesEnd].name}`)
      this.hide()
    } else{
      this.toast = toastShort('结业时间必须大于开业时间')
    }
  }
}

SelectTime.defaultProps = {
  color: '#ED5655',
  confirm: () => {},
};
// SelectTime.PropTypes = {
//   color: PropTypes.string,
//   confirm: PropTypes.func,
// };

const styles = StyleSheet.create({
  popSelect: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    bottom: 0,
    alignItems: 'center',
    overflow: 'hidden',
  },
  optictyBg: {
    height: '100%',
    width: '100%',
    backgroundColor: '#000',
  },
  selectCenter: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: styleConsts.white,
    overflow: 'hidden',
  },
  pickBox: {
    flexDirection: 'row',
  },
  picOne: {
    flex: 1,
  },
  defaultTimeBox: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    borderBottomWidth: 0.5,
    borderColor: styleConsts.lightGrey,
  },
  defaultTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    height: 39.5,
    paddingRight: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: styleConsts.white,
  },
  // border: {
  //   borderColor: styleConsts.mainColor,
  // },
  middelLine: {
    height: 40,
    width: 0.5,
    backgroundColor: styleConsts.lightGrey,
    marginLeft: 6,
    marginRight: 6,
  },
  title: {
    fontSize: styleConsts.H4,
    color: styleConsts.deepGrey,
  },
  timeInfo: {
    fontSize: styleConsts.H4,
    color: styleConsts.darkGrey,
  },
  btnBox: {
    flexDirection: 'row',
  },
  btn: {
    marginRight: 10,
    justifyContent: 'center',
    height: 40,
  },
  btnInfo: {
    fontSize: styleConsts.H4,
    color: styleConsts.deepGrey,
  },
})
