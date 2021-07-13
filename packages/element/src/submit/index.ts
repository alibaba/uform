import { h, useForm } from '@formily/vue'
import { observer } from '@formily/reactive-vue'
import { defineComponent } from 'vue-demi'

import type { Button as ElButtonProps } from 'element-ui'
import { Button as ElButton } from 'element-ui'

export type SubmitProps = ElButtonProps

export const Submit = observer(
  defineComponent<SubmitProps>({
    setup(props, context) {
      const formRef = useForm()

      const { listeners, slots, attrs } = context

      return () => {
        const form = formRef?.value
        return h(
          ElButton,
          {
            attrs: {
              nativeType: listeners?.submit ? 'button' : 'submit',
              type: 'primary',
              ...attrs,
              loading:
                attrs.loading !== undefined ? attrs.loading : form?.submitting,
            },
            on: {
              ...listeners,
              click: (e: any) => {
                if (listeners?.click) {
                  if (listeners.click(e) === false) return
                }
                if (listeners?.submit) {
                  form
                    ?.submit(listeners.submit as (e: any) => void)
                    .then(listeners.submitSuccess as (e: any) => void)
                    .catch(listeners.submitFailed as (e: any) => void)
                }
              },
            },
          },
          slots
        )
      }
    },
  })
)
