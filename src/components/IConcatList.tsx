import { Component } from 'react'
import { List, Image } from 'antd-mobile'
import { commonParam } from '../utils/componentUtils'
import '../style/IConcatList.less'
import '../style/common.less'
import SvgIcon from '../icons/SvgIcon'
interface IState extends IDMCommonState {
    users: Array<any>
    avatarWidth: number
    avatarHeight: number
    avatarRadius: number
}
const item = {
    avatar: 'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
    username: '张三',
    department: 'XXX部门',
    time: '2022-09-21 10:21',
    phone: 15555555555
}
class IConcatList extends Component<IDMCommonProp, IState> {
    constructor(rootProps: IDMCommonProp | Readonly<IDMCommonProp>) {
        super(rootProps)
        this.state = {
            propData: {
                title: '测试文本',
                styleType: 'two',
                buttonText: '提醒',
                avatarField: 'avatar',
                usernameField: 'username',
                phoneField: 'phone',
                departmentField: 'department',
                timeField: 'time'
            },
            avatarWidth: 45,
            avatarHeight: 45,
            avatarRadius: 30,
            users: Array(6).fill(item)
        }
    }
    setContextValue(object: { type: string }) {
        console.log('统一接口设置的值', object)
        if (object.type !== 'pageCommonInterface') {
            return
        }
    }
    /**
     * 主题颜色
     */
    convertThemeListAttrToStyleObject() {
        const { id } = this.props
        const { propData } = this.state
        var themeList = propData.themeList
        if (!themeList) {
            return
        }
        const themeNamePrefix =
            IDM.setting && IDM.setting.applications && IDM.setting.applications.themeNamePrefix
                ? IDM.setting.applications.themeNamePrefix
                : 'idm-theme-'
        for (var i = 0; i < themeList.length; i++) {
            var item = themeList[i]
            let bgColorObj = {
                'background-color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
            }
            IDM.setStyleToPageHead('.' + themeNamePrefix + item.key + ` #${id} .right-button`, bgColorObj)
        }
    }
    /**
     * 通用的获取表达式匹配后的结果
     */
    getExpressData(dataName: string | number, dataFiled: any, resultData: any) {
        //给defaultValue设置dataFiled的值
        var _defaultVal: any = undefined
        if (dataFiled) {
            var filedExp = dataFiled
            filedExp = dataName + (filedExp.startsWiths('[') ? '' : '.') + filedExp
            var dataObject = { IDM: window.IDM }
            dataObject[dataName] = resultData
            _defaultVal = IDM.express.replace.call(this, '@[' + filedExp + ']', dataObject)
        }
        //对结果进行再次函数自定义
        if (this.state.propData.customFunction && this.state.propData.customFunction.length > 0) {
            var params = commonParam()
            var resValue = ''
            try {
                const funcName: string | undefined = this.state.propData.customFunction[0].name
                resValue =
                    funcName &&
                    window[funcName] &&
                    window[funcName].call(this, {
                        ...params,
                        ...this.state.propData.customFunction[0].param,
                        moduleObject: this.state.moduleObject,
                        expressData: _defaultVal,
                        interfaceData: resultData
                    })
            } catch (error) {}
            _defaultVal = resValue
        }

        return _defaultVal
    }
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject() {
        const { id } = this.props
        const { propData } = this.state
        const styleObject = {},
            buttonStyleObj = {},
            phoneIconStyleObj = {},
            usernameFontObj = {},
            phoneFontObj = {},
            deportmentFontObj = {},
            timeFontObj = {},
            lineBorderObj = {}
        if (propData.bgSize && propData.bgSize === 'custom') {
            styleObject['background-size'] =
                (propData.bgSizeWidth ? propData.bgSizeWidth.inputVal + propData.bgSizeWidth.selectVal : 'auto') +
                ' ' +
                (propData.bgSizeHeight ? propData.bgSizeHeight.inputVal + propData.bgSizeHeight.selectVal : 'auto')
        } else if (propData.bgSize) {
            styleObject['background-size'] = propData.bgSize
        }
        if (propData.positionX && propData.positionX.inputVal) {
            styleObject['background-position-x'] = propData.positionX.inputVal + propData.positionX.selectVal
        }
        if (propData.positionY && propData.positionY.inputVal) {
            styleObject['background-position-y'] = propData.positionY.inputVal + propData.positionY.selectVal
        }
        for (const key in propData) {
            if (propData.hasOwnProperty.call(propData, key)) {
                const element = propData[key]
                if (!element && element !== false && element !== 0) {
                    continue
                }
                switch (key) {
                    case 'width':
                        styleObject[key] = element
                        break
                    case 'height':
                        styleObject[key] = element
                        break
                    case 'box':
                        IDM.style.setBoxStyle(styleObject, element)
                        break
                    case 'border':
                        IDM.style.setBorderStyle(styleObject, element)
                        break
                    case 'bgColor':
                        if (element && element.hex8) {
                            styleObject['background-color'] = window.IDM.hex8ToRgbaString(element.hex8) + ' !important'
                        }
                        break
                    case 'bgImgUrl':
                        styleObject['background-image'] = `url(${window.IDM.url.getWebPath(element)})`
                        break
                    case 'avatarWidth':
                        this.setState({
                            avatarWidth: element
                        })
                        break
                    case 'avatarHeight':
                        this.setState({
                            avatarHeight: element
                        })
                        break
                    case 'avatarRadius':
                        this.setState({
                            avatarRadius: element
                        })
                        break
                    case 'buttonBgColor':
                        if (element && element.hex8) {
                            buttonStyleObj['background-color'] =
                                window.IDM.hex8ToRgbaString(element.hex8) + ' !important'
                        }
                        break
                    case 'buttonRadius':
                        IDM.style.setBorderStyle(buttonStyleObj, element)
                        break
                    case 'buttonBox':
                        IDM.style.setBoxStyle(buttonStyleObj, element)
                        break
                    case 'buttonFont':
                        IDM.style.setFontStyle(buttonStyleObj, element)
                        break
                    case 'iconSize':
                        phoneIconStyleObj['width'] = element + 'px'
                        phoneIconStyleObj['height'] = element + 'px'
                        break
                    case 'iconColor':
                        if (element && element.hex8) {
                            phoneIconStyleObj['color'] = window.IDM.hex8ToRgbaString(element.hex8)
                            phoneIconStyleObj['fill'] = window.IDM.hex8ToRgbaString(element.hex8)
                        }
                        break
                    case 'usernameFont':
                        IDM.style.setFontStyle(usernameFontObj, element)
                        break
                    case 'phoneFont':
                        IDM.style.setFontStyle(phoneFontObj, element)
                        break
                    case 'deportmentFont':
                        IDM.style.setFontStyle(deportmentFontObj, element)
                        break
                    case 'timeFont':
                        IDM.style.setFontStyle(timeFontObj, element)
                        break
                    case 'lineBorder':
                        IDM.style.setBorderStyle(lineBorderObj, element)
                }
            }
        }
        window.IDM.setStyleToPageHead(id, styleObject)
        window.IDM.setStyleToPageHead(id + ' .right-button', buttonStyleObj)
        window.IDM.setStyleToPageHead(id + ' .phone-img', phoneIconStyleObj)
        window.IDM.setStyleToPageHead(id + ' .user-name', usernameFontObj)
        window.IDM.setStyleToPageHead(id + ' .user-phone', phoneFontObj)
        window.IDM.setStyleToPageHead(id + ' .user-department', deportmentFontObj)
        window.IDM.setStyleToPageHead(id + ' .user-time', timeFontObj)
        window.IDM.setStyleToPageHead(id + ' .adm-list-item-content', lineBorderObj)
        this.initData()
    }
    getFieldData(fieldStr: any, dataObj: any) {
        return IDM.express.replace(`@[${fieldStr}]`, dataObj, true)
    }
    /**
     * 重新加载
     */
    reload() {
        //请求数据源
        this.initData()
    }
    /**
     * 加载动态数据
     */
    initData() {}
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData: any) {
        // setState是异步， 其他操作要放在回调里，避免initData内数据不同步
        this.setState({ propData }, () => {
            this.convertAttrToStyleObject()
            this.convertThemeListAttrToStyleObject()
        })
    }
    /**
     * 组件通信：接收消息的方法
     * @param {
     *  type:"发送消息的时候定义的类型，这里可以自己用来要具体做什么，统一规定的type：linkageResult（组件联动传结果值）、linkageDemand（组件联动传需求值）、linkageReload（联动组件重新加载）
     * 、linkageOpenDialog（打开弹窗）、linkageCloseDialog（关闭弹窗）、linkageShowModule（显示组件）、linkageHideModule（隐藏组件）、linkageResetDefaultValue（重置默认值）"
     *  message:{发送的时候传输的消息对象数据}
     *  messageKey:"消息数据的key值，代表数据类型是什么，常用于表单交互上，比如通过这个key判断是什么数据"
     *  isAcross:如果为true则代表发送来源是其他页面的组件，默认为false
     * } object
     */
    receiveBroadcastMessage(object: string) {
        console.log('收到消息  --- > ' + object)
    }

    render() {
        const { getFieldData } = this
        const { id } = this.props
        const { propData, users, avatarWidth, avatarHeight, avatarRadius } = this.state
        return (
            <div idm-ctrl='idm_module' id={id} idm-ctrl-id={id} className='idm-common-concat-list'>
                <List>
                    {users.map((item, index) => (
                        <List.Item
                            key={index}
                            prefix={
                                <Image
                                    src={getFieldData(propData.avatarField, item)}
                                    style={{ borderRadius: avatarRadius }}
                                    fit='cover'
                                    width={avatarWidth}
                                    height={avatarHeight}
                                />
                            }
                        >
                            {propData.styleType === 'one' ? (
                                <div className='flex-between style-one-container'>
                                    <div className='flex-between flex-1'>
                                        <div className='center-left'>
                                            <div className='user-name'>
                                                {getFieldData(propData.usernameField, item)}
                                            </div>
                                            <div className='user-department'>
                                                {getFieldData(propData.departmentField, item)}
                                            </div>
                                        </div>
                                        <div className='center-right'>
                                            <div className='user-phone'>{getFieldData(propData.phoneField, item)}</div>
                                            <div className='user-time'>{getFieldData(propData.timeField, item)}</div>
                                        </div>
                                    </div>
                                    <div className='right-button'>{propData.buttonText}</div>
                                </div>
                            ) : (
                                <div className='flex-between style-two-container'>
                                    <div className='flex flex-1'>
                                        <div className='user-name'>{getFieldData(propData.usernameField, item)}</div>
                                        <div className='user-department'>
                                            {getFieldData(propData.departmentField, item)}
                                        </div>
                                    </div>
                                    <div className='flex-between'>
                                        {propData.phoneIcon && propData.phoneIcon.length > 0 ? (
                                            <svg className='phone-img' aria-hidden='true'>
                                                <use xlinkHref={`#${propData.phoneIcon[0]}`}></use>
                                            </svg>
                                        ) : (
                                            <SvgIcon iconClass='phone' className='phone-img'></SvgIcon>
                                        )}
                                        <span className='user-phone'>{getFieldData(propData.phoneField, item)}</span>
                                    </div>
                                </div>
                            )}
                        </List.Item>
                    ))}
                </List>
            </div>
        )
    }
}

export default IConcatList
