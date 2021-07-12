import React, { useEffect, useState, useRef } from 'react'
import { Button } from 'antd'
import { usePrefix, IconWidget } from '@designable/react'
import cls from 'classnames'
import './styles.less'

export interface IInput {
  style?: React.CSSProperties
  className?: string
  value: any
  onChange: (value: any) => void
  exclude?: string[]
  include?: string[]
}

export interface IPolyType {
  type: string
  title?: string
  icon?: string
  component?: any
  checker: (value: any) => boolean
  toInputValue?: (value: any) => any
  toChangeValue?: (value: any) => any
}

export type PolyTypes = IPolyType[]

const isValid = (val: any) => val !== undefined && val !== null

const getEventValue = (event: any) => {
  if (event?.target) {
    if (isValid(event.target.value)) return event.target.value
    if (isValid(event.target.checked)) return event.target.checked
    return
  }
  return event
}

const createTypes = (
  types: PolyTypes,
  exclude: string[],
  include: string[]
) => {
  return types.filter(({ type }) => {
    if (Array.isArray(include) && include.length) {
      return include.includes(type)
    }
    if (Array.isArray(exclude) && exclude.length) {
      return !exclude.includes(type)
    }
    return true
  })
}

export function createPolyInput(polyTypes: PolyTypes = []): React.FC<IInput> {
  return ({
    className,
    style,
    value,
    onChange,
    exclude,
    include,
    ...props
  }) => {
    const prefix = usePrefix('poly-input')
    const types = createTypes(polyTypes, exclude, include)
    const [current, setCurrent] = useState(types[0]?.type)
    const type = types?.find(({ type }) => type === current)
    const component = type?.component
    const typesValue = useRef({})
    useEffect(() => {
      types?.forEach(({ checker, type }) => {
        if (checker(value)) {
          setCurrent(type)
        }
      })
    }, [value])

    const getNextType = () => {
      const currentIndex = types?.findIndex(({ type }) => type === current)
      const nextIndex =
        currentIndex + 1 > types?.length - 1 ? 0 : currentIndex + 1
      return types[nextIndex]
    }

    const transformOnChangeValue = (value: any, type: IPolyType) => {
      return type?.toChangeValue ? type?.toChangeValue(value) : value
    }

    return (
      <div className={cls(prefix, className)} style={style}>
        {component && (
          <div className={prefix + '-content'}>
            {React.createElement(component, {
              ...props,
              value: type?.toInputValue ? type?.toInputValue(value) : value,
              onChange: (event: any) => {
                const value = getEventValue(event)
                typesValue.current[type?.type] = value
                onChange?.(transformOnChangeValue(value, type))
              },
            })}
          </div>
        )}
        <Button
          className={prefix + '-controller'}
          style={{
            width: !component ? '100%' : 'auto',
          }}
          block
          onClick={() => {
            const nextType = getNextType()
            if (nextType === type) return
            setCurrent(nextType?.type)
            onChange?.(
              transformOnChangeValue(
                typesValue.current[nextType?.type],
                nextType
              )
            )
          }}
        >
          {type?.icon ? (
            <IconWidget infer={type.icon} />
          ) : (
            type?.title || type?.type
          )}
        </Button>
      </div>
    )
  }
}
