<template>
  <Form :form="form">
    <SchemaField
      :schema="schema"
      :scope="{ useAsyncDataSource, transformAddress }"
    />
    <Submit @submit="onSubmit">提交</Submit>
  </Form>
</template>

<script>
import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/vue'
import { Form, FormItem, Cascader, Submit } from '@formily/element'
import { action } from '@formily/reactive'
import axios from 'axios'

const transformAddress = (data = {}) => {
  return Object.entries(data).reduce((buf, [key, value]) => {
    if (typeof value === 'string')
      return buf.concat({
        label: value,
        value: key,
      })
    const { name, code, cities, districts } = value
    const _cities = transformAddress(cities)
    const _districts = transformAddress(districts)
    return buf.concat({
      label: name,
      value: code,
      children: _cities.length
        ? _cities
        : _districts.length
        ? _districts
        : undefined,
    })
  }, [])
}

const useAsyncDataSource = (url, transform) => {
  return (field) => {
    field.loading = true
    axios
      .get(url)
      .then((res) => res.data)
      .then(
        action((data) => {
          field.dataSource = transform(data)
          field.loading = false
        })
      )
  }
}

const schema = {
  type: 'object',
  properties: {
    cascader: {
      type: 'string',
      title: '复选',
      'x-decorator': 'FormItem',
      'x-component': 'Cascader',
      'x-reactions': [
        '{{useAsyncDataSource("//unpkg.com/china-location/dist/location.json",transformAddress)}}',
      ],
    },
  },
}

const form = createForm()
const { SchemaField } = createSchemaField({
  components: {
    FormItem,
    Cascader,
  },
})

export default {
  components: { Form, SchemaField, Submit },
  data() {
    return {
      useAsyncDataSource,
      transformAddress,
      form,
      schema,
    }
  },
  methods: {
    onSubmit(value) {
      console.log(value)
    },
  },
}
</script>
l
