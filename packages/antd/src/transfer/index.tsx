import { connect, mapProps } from '@formily/react'
import { Transfer as AntdTransfer } from 'antd'
import { isVoidField } from '@formily/core'

export const Transfer = connect(
  AntdTransfer,
  mapProps(
    {
      value: 'targetKeys',
    },
    (props, field) => {
      if (isVoidField(field)) return props
      return {
        ...props,
        dataSource:
          field.dataSource?.map((item) => {
            return {
              ...item,
              title: item.title || item.label,
              key: item.key || item.value,
            }
          }) || [],
      }
    }
  )
)

Transfer.defaultProps = {
  render: (item) => item.title,
}

export default Transfer
