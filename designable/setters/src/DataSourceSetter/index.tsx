import React, { Fragment, useMemo, useState } from 'react'
import cls from 'classnames'
import { Modal, Button } from 'antd'
import { observable } from '@formily/reactive'
import { observer } from '@formily/reactive-react'
import { GlobalRegistry } from '@designable/core'
import { usePrefix, useTheme } from '@designable/react'
import { DataSettingPanel } from './DataSettingPanel'
import { TreePanel } from './TreePanel'
import { transformDataToValue, transformValueToData } from './shared'
import { IDataSourceItem, ITreeDataSource } from './types'
import './styles.less'

export interface IBorderStyleSetterProps {
  className?: string
  style?: React.CSSProperties
  onChange: (v) => void
  value: IDataSourceItem[]
}
export const DataSourceSetter: React.FC<IBorderStyleSetterProps> = observer(
  (props) => {
    const { className, value = [], onChange } = props
    const theme = useTheme()
    const prefix = usePrefix('data-source-setter')
    const [modalVisible, setModalVisible] = useState(false)
    const treeDataSource: ITreeDataSource = useMemo(
      () =>
        observable({
          dataSource: transformValueToData(value),
          selectedkey: '',
        }),
      [value]
    )
    const openModal = () => setModalVisible(true)
    const closeModal = () => setModalVisible(false)

    return (
      <Fragment>
        <Button onClick={openModal}>
          {GlobalRegistry.getDesignerMessage('components.configureDataSource')}
        </Button>
        <Modal
          width={'50%'}
          title={GlobalRegistry.getDesignerMessage('components.dataSource')}
          visible={modalVisible}
          onCancel={closeModal}
          onOk={() => {
            onChange(transformDataToValue(treeDataSource.dataSource))
            closeModal()
          }}
        >
          <div
            className={`${cls(prefix, className)} ${prefix + '-' + theme} ${
              prefix + '-layout'
            }`}
          >
            <div className={`${prefix + '-layout-item'}`}>
              <TreePanel treeDataSource={treeDataSource}></TreePanel>
            </div>
            <div className={`${prefix + '-layout-item'}`}>
              <DataSettingPanel
                treeDataSource={treeDataSource}
              ></DataSettingPanel>
            </div>
          </div>
        </Modal>
      </Fragment>
    )
  }
)
