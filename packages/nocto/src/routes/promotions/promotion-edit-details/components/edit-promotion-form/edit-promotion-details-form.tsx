import { zodResolver } from "@hookform/resolvers/zod"
import { AdminPromotion } from "@medusajs/types"
import {
  Button,
  CurrencyInput,
  Input,
  RadioGroup,
  Switch,
  Text,
} from "@medusajs/ui"
import { useForm, useWatch } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { useEffect } from "react"
import * as zod from "zod"

import { Form } from "../../../../../components/common/form"
import { DeprecatedPercentageInput } from "../../../../../components/inputs/percentage-input"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useUpdatePromotion } from "../../../../../hooks/api/promotions"
import { getCurrencySymbol } from "../../../../../lib/data/currencies"
import { SwitchBox } from "../../../../../components/common/switch-box"

type EditPromotionFormProps = {
  promotion: AdminPromotion
}

const EditPromotionSchema = zod.object({
  is_automatic: zod.string().toLowerCase(),
  code: zod.string().min(1),
  is_tax_inclusive: zod.boolean().optional(),
  status: zod.enum(["active", "inactive", "draft"]),
  value_type: zod.enum(["fixed", "percentage"]),
  value: zod.number(),
  allocation: zod.enum(["each", "across"]),
})

export const EditPromotionDetailsForm = ({
  promotion,
}: EditPromotionFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof EditPromotionSchema>>({
    defaultValues: {
      is_automatic: promotion.is_automatic!.toString(),
      is_tax_inclusive: promotion.is_tax_inclusive,
      code: promotion.code,
      status: promotion.status,
      value: promotion.application_method!.value,
      allocation: promotion.application_method!.allocation,
      value_type: promotion.application_method!.type,
    },
    resolver: zodResolver(EditPromotionSchema),
  })

  const watchValueType = useWatch({
    control: form.control,
    name: "value_type",
  })

  const isFixedValueType = watchValueType === "fixed"

  const { mutateAsync, isPending } = useUpdatePromotion(promotion.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        is_automatic: data.is_automatic === "true",
        code: data.code,
        status: data.status,
        is_tax_inclusive: data.is_tax_inclusive,
        application_method: {
          value: data.value,
          type: data.value_type as any,
          allocation: data.allocation as any,
        },
      },
      {
        onSuccess: () => {
          handleSuccess()
        },
      }
    )
  })

  const allocationWatchValue = useWatch({
    control: form.control,
    name: "value_type",
  })

  useEffect(() => {
    if (!(allocationWatchValue === "fixed" && promotion.type === "standard")) {
      form.setValue("is_tax_inclusive", false)
    }
  }, [allocationWatchValue, form, promotion])

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-8 overflow-y-auto">
          <div className="flex flex-col gap-y-8">
            <Form.Field
              control={form.control}
              name="status"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("promotions.form.status.label")}</Form.Label>
                    <Form.Control>
                      <RadioGroup
                        className="flex-col gap-y-3"
                        {...field}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <RadioGroup.ChoiceBox
                          value={"draft"}
                          label={t("promotions.form.status.draft.title")}
                          description={t(
                            "promotions.form.status.draft.description"
                          )}
                        />

                        <RadioGroup.ChoiceBox
                          value={"active"}
                          label={t("promotions.form.status.active.title")}
                          description={t(
                            "promotions.form.status.active.description"
                          )}
                        />

                        <RadioGroup.ChoiceBox
                          value={"inactive"}
                          label={t("promotions.form.status.inactive.title")}
                          description={t(
                            "promotions.form.status.inactive.description"
                          )}
                        />
                      </RadioGroup>
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />

            <Form.Field
              control={form.control}
              name="is_automatic"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("promotions.form.method.label")}</Form.Label>
                    <Form.Control>
                      <RadioGroup
                        className="flex-col gap-y-3"
                        {...field}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <RadioGroup.ChoiceBox
                          value={"false"}
                          label={t("promotions.form.method.code.title")}
                          description={t(
                            "promotions.form.method.code.description"
                          )}
                        />
                        <RadioGroup.ChoiceBox
                          value={"true"}
                          label={t("promotions.form.method.automatic.title")}
                          description={t(
                            "promotions.form.method.automatic.description"
                          )}
                        />
                      </RadioGroup>
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />

            {allocationWatchValue === "fixed" &&
              promotion.type === "standard" && (
                <SwitchBox
                  control={form.control}
                  name="is_tax_inclusive"
                  label={t("promotions.form.taxInclusive.title")}
                  description={t("promotions.form.taxInclusive.description")}
                />
              )}

            <div className="flex flex-col gap-y-4">
              <Form.Field
                control={form.control}
                name="code"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("promotions.form.code.title")}</Form.Label>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                    </Form.Item>
                  )
                }}
              />

              <Text
                size="small"
                leading="compact"
                className="text-ui-fg-subtle"
              >
                <Trans
                  t={t}
                  i18nKey="promotions.form.code.description"
                  components={[<br key="break" />]}
                />
              </Text>
            </div>

            <Form.Field
              control={form.control}
              name="value_type"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("promotions.fields.value_type")}</Form.Label>
                    <Form.Control>
                      <RadioGroup
                        className="flex-col gap-y-3"
                        {...field}
                        onValueChange={field.onChange}
                      >
                        <RadioGroup.ChoiceBox
                          value={"fixed"}
                          label={t("promotions.form.value_type.fixed.title")}
                          description={t(
                            "promotions.form.value_type.fixed.description"
                          )}
                        />

                        <RadioGroup.ChoiceBox
                          value={"percentage"}
                          label={t(
                            "promotions.form.value_type.percentage.title"
                          )}
                          description={t(
                            "promotions.form.value_type.percentage.description"
                          )}
                        />
                      </RadioGroup>
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />

            <Form.Field
              control={form.control}
              name="value"
              render={({ field: { onChange, ...field } }) => {
                const currencyCode =
                  promotion.application_method?.currency_code ?? "USD"

                return (
                  <Form.Item>
                    <Form.Label>
                      {isFixedValueType
                        ? t("fields.amount")
                        : t("fields.percentage")}
                    </Form.Label>
                    <Form.Control>
                      {isFixedValueType ? (
                        <CurrencyInput
                          min={0}
                          onValueChange={(val) =>
                            onChange(val ? parseInt(val) : null)
                          }
                          code={currencyCode}
                          symbol={getCurrencySymbol(currencyCode)}
                          {...field}
                          value={field.value}
                        />
                      ) : (
                        <DeprecatedPercentageInput
                          key="amount"
                          min={0}
                          max={100}
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            onChange(
                              e.target.value === ""
                                ? null
                                : parseInt(e.target.value)
                            )
                          }}
                        />
                      )}
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />

            <Form.Field
              control={form.control}
              name="allocation"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("promotions.fields.allocation")}</Form.Label>
                    <Form.Control>
                      <RadioGroup
                        className="flex-col gap-y-3"
                        {...field}
                        onValueChange={field.onChange}
                      >
                        <RadioGroup.ChoiceBox
                          value={"each"}
                          label={t("promotions.form.allocation.each.title")}
                          description={t(
                            "promotions.form.allocation.each.description"
                          )}
                        />

                        <RadioGroup.ChoiceBox
                          value={"across"}
                          label={t("promotions.form.allocation.across.title")}
                          description={t(
                            "promotions.form.allocation.across.description"
                          )}
                        />
                      </RadioGroup>
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          </div>
        </RouteDrawer.Body>

        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>

            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
