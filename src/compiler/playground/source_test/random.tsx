import { Format, NumberFormatter, PercentageFormatter } from '@zervant/reactcomponents';
import 'InvoiceEditor.scss';
import * as React from 'react';
import { defaultLine } from '../../actions/helpers/draft';
import { Analytics } from '../../Global/Analytics';
import { AnalyticsType, Category, Events, Placement, Result, trackingFields } from '../../Global/AnalyticsEvents';
import { Container } from '../../Global/Container';
import { CollectionInterface } from '../../Interfaces/CollectionInterface';
import { CustomerInterface } from '../../Interfaces/CustomerInterface';
import { DiscountLocation, DiscountState, DiscountType, DiscountVAT } from '../../Interfaces/DiscountSettingsInterface';
import { DocumentTypes, DraftInterface, InvoiceTypes } from '../../Interfaces/Draft/DraftInterface';
import { InvoiceItemType } from '../../Interfaces/Draft/DraftItemType';
import { FieldInterface } from '../../Interfaces/Draft/FieldInterface';
import { DraftFieldsInterface } from '../../Interfaces/Draft/FieldsInterface';
import { LineInterface } from '../../Interfaces/Draft/LineInterface';
import { TextLineInterface } from '../../Interfaces/Draft/TextInterface';
import { ExchangeRateInterface } from '../../Interfaces/ExchangeRateInterface';
import { LabelKeys } from '../../Interfaces/LabelsInterface';
import { OrderDraftInterface } from '../../Interfaces/OrderInterface';
import {
  RecurringProfileSettingsInterface,
  RecurringProfileStatusType,
} from '../../Interfaces/RecurringProfileInterface';
import { SchemaInterface } from '../../Interfaces/Schema/SchemaInterface';
import { ModelInterface } from '../../Interfaces/Settings/ModelInterface';
import { SettingsInterface } from '../../Interfaces/Settings/SettingsInterface';
import { QuotaTypes, SubscriptionInterface } from '../../Interfaces/Subscription';
import { TokenInterface } from '../../Interfaces/TokenInterface';
import { formatDate, transformDateFormatForMoment } from '../../Other/functions/dateFunctions';
import { getDefaultDepositOrder, getDefaultScheduleOrder } from '../../Other/functions/paymentScheduleFunctions';
import { convertVatpctFromLocale } from '../../Other/functions/vatFunctions';
import { l, tsxl } from '../../Other/Translation';
import { Type } from '../../Other/Type';
import { doesCurrentPlanSupportFeature } from '../../reducers/Subscription/companySubscription';
import { Button, ButtonType } from '../common/Button/Button';
import { Document } from '../common/Document/Document';
import { FieldCreator } from '../common/FieldCreator';
import { Input } from '../common/Input/Input';
import { Layout, LayoutColumn } from '../common/Layout/Layout';
import { NumberInput } from '../common/NumberInput';
import { CustomerSelector } from '../CustomerSelector/CustomerSelector';
import { InvoiceEditorHeading } from './InvoiceEditorHeading/InvoiceEditorHeading';
import { DiscountSettings } from './DiscountSettings/DiscountSettings';
import { InvoiceHeader } from './InvoiceHeader/InvoiceHeader';
import { InvoiceItems } from './InvoiceItems';
import { PaymentScheduleSettings, PaymentScheduleType } from './PaymentScheduleSettings/PaymentScheduleSettings';
import { RecurringProfileSettings } from './RecurringProfilesSettings/RecurringProfileSettings';
import { SubtotalLine } from './SubtotalLine';
import { InvoiceTextLine } from './TextLine';
import { InvoiceTitleLine } from './TitleLine';
import keys from '../txtkeys/recurringProfileKeys';
import { CheckBox } from '../common/CheckBox/CheckBox';
import { getDefaultRecurringProfile } from '../../actions/helpers/recurringProfile';
import { AddressInterface } from '../../Interfaces/AddressInterface';
import { isValidPaymentMethod } from '../../Other/functions/documentFunctions';
import InvoiceSettings from './InvoiceSettings/InvoiceSettings';
import { PromotionalToolTip } from '../common/PromotionalToolTip/PromotionalToolTip';
import * as promotionsApi from '../../api/promotionsCheck';

export interface InvoiceEditorPropsInterface {
  subscription?: SubscriptionInterface;
  drafts?: CollectionInterface<DraftInterface>;
  draft?: DraftInterface;
  recurringProfile?: RecurringProfileSettingsInterface;
  settings?: SettingsInterface;
  token?: TokenInterface;
  language?: string;
  config?: any;
  customers?: CollectionInterface<CustomerInterface>;
  automation?: string;
  company?: any;
  products?: any;
  hasRightsToPaymentSchedules?: boolean;
  hasRightsToRecurringProfile?: boolean;
  isRecurringProfile?: boolean;
  showRecurringProfilePromotion: boolean;
  selectMaps?: {
    tradeNames: { [key: string]: string };
    paymentMethods: { [key: string]: string };
    templates: { [key: string]: string };
    currencies: { [key: string]: string };
    languages: { [key: string]: string };
    columnNames: { [key: string]: string };
    invoiceTypes: { [key: string]: string };
  };
  internal?: {
    model: ModelInterface;
    language: string;
    template: string;
    visibleColumns: string[];
    lineColumns: string[];
    schema: SchemaInterface;
    taxFree: boolean;
    currencySymbol: string;
    defaultCurrency: string;
  };
  // redux actions
  initDraft?: () => void;
  getCustomers?: () => void;
  getCompany?: () => void;
  getProducts?: () => void;
  getConfigs?: () => void;
  getSettings?: () => void;
  getFreetexts?: () => void;
  getTranslations?: (lang: string) => void;
  changeFields?: (fields: DraftFieldsInterface) => void;
  changeStyles?: (settings: SettingsInterface) => void;
  changeCustomer?: (customer: any) => void;
  changeLines?: (lines: InvoiceItemType[]) => void;
  changeDraft?: (draft: DraftInterface) => void;
  previewDraft?: (draft: DraftInterface) => void;
  previewRecurringProfile?: (draft: DraftInterface, profile: RecurringProfileSettingsInterface) => void;
  draftSaveAndClose?: (draft: DraftInterface) => void;
  exchangeRate?: ExchangeRateInterface;
  getExchangeRate?: () => void;
  openCustomerModal?: (customer: CustomerInterface) => void;
  onDocumentNumberEdit?: () => void;
  closeEditor?: (draft: DraftInterface) => void;
  ongoing?: any;
  openDownpaymentModal?: () => void;
  openPaymentScheduleModal?: () => void;
  openRecurringProfileIntermediaryModal: () => void;
  openProductModal?: (index) => void;
  openVATOptions?: () => void;
  openUnitOptions?: () => void;
  updateOrder?: (order: OrderDraftInterface) => void;
  deleteOrder?: () => void;
  navigateToInvoicingSettings?: () => void;
  navigateToCompanySettings?: (draft: DraftInterface, TradenameId?: string) => void;
  updateRecurringProfileSettings?: (profile: RecurringProfileSettingsInterface) => void;
  deleteRecurringProfileSettings?: () => void;
}

export class InvoiceEditor extends Container<InvoiceEditorPropsInterface> {
  private currencyF: NumberFormatter;
  private exchangeRateF: NumberFormatter;

  constructor(props) {
    super(props);

    this.props.getFreetexts();
    this.props.getTranslations(props.token.locale);
    this.props.getTranslations(props.token.locale);
    this.state = {
      isVisibleExchangeRate: false,
      showRecurringProfilePromotion: false,
      orderType:
        this.props.draft.order && this.props.draft.order.orderType.startsWith('schedule') ? 'schedule' : 'downPayment',
    };
    this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
    this.handleExchangeRateChange = this.handleExchangeRateChange.bind(this);
  }

  private isVATLessSales() {
    const vatlessType = 127;
    const value = Number(this.props.draft.fields.type.value);
    return value === vatlessType;
  }

  public componentDidMount() {
    const {
      draft,
      changeFields,
      exchangeRate,
      changeDraft,
      internal: { defaultCurrency },
    } = this.props;
    const { fields } = draft;
    const selectedCurrency = fields.currency.value;
    const shouldRenderRate = selectedCurrency !== defaultCurrency;

    this.props.getProducts(); // get fresh products when component mounts

    if (shouldRenderRate) {
      changeDraft({
        ...draft,
        isDirty: false,
        fields: {
          ...fields,
          exchangeRate: {
            ...fields.exchangeRate,
            value: exchangeRate[selectedCurrency] / exchangeRate[defaultCurrency],
          },
        },
      });
      this.setState({
        isVisibleExchangeRate: true,
      });
    }
    if (draft && draft.receiver && draft.receiver.id && draft.document === DocumentTypes.INVOICE) {
      this.checkCustomerAndChangeShowPromotionState(draft.receiver.id);
    }
  }

  public componentWillReceiveProps(props) {
    this.props = props;
    if (!this.props.settings && !this.props.ongoing.LOAD_SETTINGS) {
      this.props.getSettings();
      return;
    }

    if (props.token && props.internal && props.internal.currencySymbol) {
      this.currencyF = new NumberFormatter(Format.fromLocale(props.token.locale), props.internal.currencySymbol);
    }

    if (props.token && props.internal) {
      this.exchangeRateF = new NumberFormatter(Format.fromLocale(props.token.locale));
    }

    // TODO: Because ACTIONS.LOAD_VITALS is called before rendering InvoiceEditor, config will always be defined
    //      Later when LOAD_VITALS eventually gets refactored, this will become useful.
    if (!this.props.config && !this.props.ongoing['GET_CONFIG']) {
      this.props.getConfigs();
      return;
    }

    if (!this.props.company && !this.props.ongoing['GET_COMPANY']) {
      this.props.getCompany();
      return;
    }

    // TODO: Because ACTIONS.LOAD_VITALS is called before rendering InvoiceEditor, customers will always be defined
    //      Later when LOAD_VITALS eventually gets refactored, this will become useful.
    if (!this.props.customers && !this.props.ongoing['GET_CUSTOMERS']) {
      this.props.getCustomers();
      return;
    }

    if (!this.props.products && !this.props.ongoing['GET_PRODUCTS']) {
      this.props.getProducts();
      return;
    }

    // TODO: Because ACTIONS.LOAD_VITALS is called before rendering InvoiceEditor, products will always be defined
    //      Later when LOAD_VITALS eventually gets refactored, this will become useful.
    if (!this.props.exchangeRate && !this.props.ongoing['GET_EXCHANGE_RATE']) {
      this.props.getExchangeRate();
      return;
    }
  }

  private handleCurrencyChange(selectedCurrency: string): void {
    const {
      draft: { fields },
      exchangeRate,
      changeFields,
      internal: { defaultCurrency },
    } = this.props;

    if (fields.currency.value === selectedCurrency) {
      return;
    }

    const shouldRenderRate = selectedCurrency !== defaultCurrency;

    changeFields({
      ...fields,
      currency: {
        ...fields.currency,
        value: selectedCurrency,
      },
      exchangeRate: {
        ...fields.exchangeRate,
        value: shouldRenderRate ? exchangeRate[selectedCurrency] / exchangeRate[defaultCurrency] : null,
      },
    });

    this.setState({
      isVisibleExchangeRate: shouldRenderRate,
    });
  }

  private handleExchangeRateChange(valueChange: number): void {
    const {
      draft: { fields },
      changeFields,
    } = this.props;
    changeFields({
      ...fields,
      exchangeRate: {
        ...fields.exchangeRate,
        value: valueChange !== 0 ? valueChange : fields.exchangeRate.value,
      },
    });
  }

  private isEditingApprovedInvoice(): boolean {
    return Boolean(this.props.draft.editInvoice);
  }

  private enableRecurringSettings(FIELDS) {
    if (FIELDS.paymentScheduleEnabled.value) {
      this.props.changeFields({
        ...FIELDS,
        paymentScheduleEnabled: { ...FIELDS.paymentScheduleEnabled, value: false },
        recurringProfileEnabled: { ...FIELDS.recurringProfileEnabled, value: true },
      });
      this.props.deleteOrder();
    } else {
      this.props.changeFields({
        ...FIELDS,
        recurringProfileEnabled: { ...FIELDS.recurringProfileEnabled, value: true },
      });
    }
    this.props.updateRecurringProfileSettings(getDefaultRecurringProfile(FIELDS.issueDate.value));
  }

  private enableDownpaymentSettings(FIELDS, type: PaymentScheduleType) {
    if (FIELDS.recurringProfileEnabled && FIELDS.recurringProfileEnabled.value) {
      this.props.changeFields({
        ...FIELDS,
        recurringProfileEnabled: { ...FIELDS.recurringProfileEnabled, value: false },
        paymentScheduleEnabled: { ...FIELDS.paymentScheduleEnabled, value: true },
      });
      this.props.deleteRecurringProfileSettings();
    } else {
      this.props.changeFields({
        ...FIELDS,
        paymentScheduleEnabled: { ...FIELDS.paymentScheduleEnabled, value: true },
      });
      InvoiceEditor.scrollIntoView('sumArea');
    }
    this.setDefaultOrder(type);
  }

  private handleDownPaymentOnChange(FIELDS, enabled: boolean, type: PaymentScheduleType) {
    Analytics.trackEvent(trackingFields.name.activatePaymentSchedule, {
      type: trackingFields.type.action,
      category: trackingFields.category.invoiceSettings,
      result: trackingFields.result.success,
      placement: trackingFields.placement.editor,
      tickbox: enabled,
      selectedOrderType: type,
      draftID: this.props.draft.id,
    });
    if (!enabled) {
      this.props.changeFields({
        ...FIELDS,
        paymentScheduleEnabled: { ...FIELDS.paymentScheduleEnabled, value: false },
      });
      this.props.deleteOrder();
    } else {
      this.enableDownpaymentSettings(FIELDS, type);
      this.setState({ orderType: type });
    }
  }

  private getDownPaymentSettings(FIELDS: DraftFieldsInterface): JSX.Element | '' {
    if ('paymentScheduleEnabled' in FIELDS) {
      return (
        <div>
          <PaymentScheduleSettings
            automation={this.props.automation + '-downPayment'}
            draft={this.props.draft}
            type={'downPayment'}
            enabled={FIELDS.paymentScheduleEnabled.value && this.state.orderType === 'downPayment'}
            onEnabledChange={(enabled: boolean) => this.handleDownPaymentOnChange(FIELDS, enabled, 'downPayment')}
          />
          <hr />
          <PaymentScheduleSettings
            automation={this.props.automation + '-paymentSchedule'}
            draft={this.props.draft}
            type={'schedule'}
            enabled={FIELDS.paymentScheduleEnabled.value && this.state.orderType === 'schedule'}
            onEnabledChange={(enabled: boolean) => this.handleDownPaymentOnChange(FIELDS, enabled, 'schedule')}
          />
          <hr />
        </div>
      );
    }
    return '';
  }
  private setDefaultOrder(value: PaymentScheduleType) {
    if (this.props.hasRightsToPaymentSchedules) {
      const defaultOrder =
        value === 'schedule' ? getDefaultScheduleOrder(this.props.draft) : getDefaultDepositOrder(this.props.draft);
      this.props.updateOrder(defaultOrder);
    }
  }
  private renderPaymentScheduleList(order: OrderDraftInterface, dateFormat, language): JSX.Element[] {
    const list: JSX.Element[] = [];
    let index = 1;
    order.items.forEach(item => {
      const key = 'paymentScheduleRow-' + index;
      list.push(
        <div className={'paymentScheduleRow'} key={key} data-automation={key}>
          <div className={'paymentNumber'}>
            {index++}/{order.items.length}
          </div>
          <div className={'due'}>
            {l('editor.paymentSchedule.due')} {formatDate(item.dueDate, dateFormat, language)}
          </div>
          <div className={'value'}>
            <NumberInput
              decimals={2}
              editable={false}
              borderless={true}
              value={item.value}
              automation={key + '-value'}
              formatter={this.currencyF}
            />
          </div>
        </div>,
      );
    });
    return list;
  }

  private renderDownPaymentBlock = (draft: DraftInterface, dateFormat, language) => {
    const order = draft.order || getDefaultDepositOrder(draft);
    const deposit = order.items[0];
    const finalPayment = order.items[1];
    const depositLabel = `${l('editor.downpayment')} ${deposit.percentage ? deposit.percentage + '%' : ''}`;
    const depositVatInfo = order.includeVat ? l('editor.downpayment.includesVAT') : l('editor.downpayment.noVAT');
    const depositDueDate = formatDate(deposit.dueDate, dateFormat, language);
    const premiumStar = !doesCurrentPlanSupportFeature(this.props.subscription, QuotaTypes.PAYMENT_SCHEDULE);
    return (
      <div className="downpaymentDeposit" data-automation={this.props.automation + '-downpayment-block'}>
        <hr className="full" />
        <span
          className="delete"
          data-automation={this.props.automation + '-downpayment-delete'}
          onClick={() => this.props.deleteOrder()}
        />
        <NumberInput
          decimals={2}
          borderless={true}
          editable={false}
          label={depositLabel}
          value={deposit.value}
          automation={this.props.automation + '-downpayment'}
          formatter={this.currencyF}
        />
        <div className="depositDue">
          <span className="dueDate">
            {l('editor.downpayment.due')} {depositDueDate}
          </span>
          <span className="vatInfo">{depositVatInfo}</span>
        </div>
        {draft.document === DocumentTypes.INVOICE && (
          <Button
            label={l('editor.downpayment.edit')}
            type={ButtonType.link}
            action={() => this.props.openDownpaymentModal()}
            automation={this.props.automation + '-downpayment-editbtn'}
            premium={premiumStar}
          />
        )}
        <hr className="full" />
        <div className="downpaymentFinal">
          <NumberInput
            decimals={2}
            borderless={true}
            editable={false}
            label={l('editor.downpayment.final')}
            value={finalPayment.value}
            automation={this.props.automation + '-downpayment-final'}
            formatter={this.currencyF}
          />
        </div>
      </div>
    );
  };

  private renderPaymentScheduleBlock = (draft: DraftInterface, dateFormat, language) => {
    const order = draft.order || getDefaultScheduleOrder(draft);
    const premiumStar = !doesCurrentPlanSupportFeature(this.props.subscription, QuotaTypes.PAYMENT_SCHEDULE);
    return (
      <div className="paymentSchedule" data-automation={this.props.automation + '-paymentSchedule-block'}>
        <hr className="full" />
        <span
          className="delete"
          data-automation={this.props.automation + '-paymentSchedule-delete'}
          onClick={() => this.props.deleteOrder()}
        />
        <div className="paymentScheduleHeader">{l('editor.paymentSchedule.header')}</div>
        {order.name && <div className="paymentScheduleProject">{order.name}</div>}
        {this.renderPaymentScheduleList(order, dateFormat, language)}
        {draft.document === DocumentTypes.INVOICE && (
          <Button
            label={l('editor.paymentSchedule.edit')}
            type={ButtonType.link}
            action={() => this.props.openPaymentScheduleModal()}
            automation={this.props.automation + '-paymentSchedule-editbtn'}
            premium={premiumStar}
          />
        )}
      </div>
    );
  };

  private getRecurringSettings(FIELDS: DraftFieldsInterface): JSX.Element | '' {
    if ('recurringProfileEnabled' in FIELDS && FIELDS.recurringProfileEnabled.value) {
      return (
        <div
          onClick={e =>
            !this.props.hasRightsToRecurringProfile
              ? this.props.openRecurringProfileIntermediaryModal()
              : e.preventDefault()
          }
        >
          <RecurringProfileSettings changeFields={fields => this.props.changeFields(fields)} />
        </div>
      );
    } else {
      return '';
    }
  }

  private static scrollIntoView(elClass: string) {
    document.getElementsByClassName(elClass)[0].scrollIntoView({ behavior: 'smooth' });
  }

  private static onChangeScrollToTop() {
    document.getElementsByClassName('editorContent')[0].scrollTo({ top: 0, behavior: 'smooth' });
  }

  private showRecurringProfileToolTip() {
    return (
      this.state.showRecurringProfilePromotion && (
        <PromotionalToolTip
          placement={'left'}
          header={{ title: l(keys.recurring.promotion.tip.title), body: l(keys.recurring.promotion.tip.body) }}
          isOpen={this.state.showRecurringProfilePromotion}
          toggleToolTip={value => this.setState({ showRecurringProfilePromotion: value })}
        />
      )
    );
  }

  private getRecurringToggle(FIELDS: DraftFieldsInterface): JSX.Element | '' {
    if (
      'recurringProfileEnabled' in FIELDS &&
      FIELDS.recurringProfileEnabled.visible &&
      !this.props.draft.id &&
      this.props.draft.document === DocumentTypes.INVOICE
    ) {
      return (
        <div className={'RecurringProfileBlock'}>
          <div className={'RecurringProfileToggle'}>
            <CheckBox
              value={FIELDS.recurringProfileEnabled.value}
              label={l(keys.recurring.panelLabel)}
              automation={'RecurringProfileToggle-enabledCheckbox'}
              onChange={(enabled: boolean) => {
                if (enabled) {
                  this.enableRecurringSettings(FIELDS);
                  InvoiceEditor.onChangeScrollToTop();
                  Analytics.trackEvent(`${Events.activateMakeRecurring}`, {
                    type: AnalyticsType.action,
                    category: Category.recurringInvoice,
                    result: Result.success,
                    placement: Placement.editor,
                  });
                } else {
                  if (!this.props.isRecurringProfile) {
                    this.props.changeFields({
                      ...FIELDS,
                      recurringProfileEnabled: { ...FIELDS.recurringProfileEnabled, value: false },
                    });
                    Analytics.trackEvent(`${Events.deActivateMakeRecurring}`, {
                      type: AnalyticsType.action,
                      category: Category.recurringInvoice,
                      result: Result.success,
                      placement: Placement.editor,
                    });
                    this.props.deleteRecurringProfileSettings();
                  }
                }
              }}
            />
            {doesCurrentPlanSupportFeature(this.props.subscription, QuotaTypes.RECURRING_PROFILE) || (
              <img
                className={'RecurringProfileToggle__star'}
                src={'/images/premiumfeature/star_with_circle_green.svg'}
              />
            )}
          </div>
          <hr />
        </div>
      );
    } else {
      return '';
    }
  }

  private orderActive = (draft: DraftInterface) =>
    draft.fields.paymentScheduleEnabled && draft.fields.paymentScheduleEnabled.value;

  private isCompanyInfoFilled = (draft: DraftInterface) => {
    // TODO: what info is necessary?
    return Boolean(draft.invoicer.tradeName && draft.invoicer.tradeName.name);
  };

  private renderInvoicerAddress(address: AddressInterface, key: string) {
    const result = [];
    if (address.streetAddress1) {
      result.push(
        <div className="addressLine" key={`invoiceAddress-${result.length}`}>
          {address.streetAddress1}
        </div>,
      );
    }
    if (address.streetAddress2) {
      result.push(
        <div className="addressLine" key={`invoiceAddress-${result.length}`}>
          {address.streetAddress2}
        </div>,
      );
    }
    if (address.city || address.pobox) {
      result.push(
        <div className="addressLine" key={`invoiceAddress-${result.length}`}>
          {address.pobox + ' ' || ''}
          {address.city}
        </div>,
      );
    }
    return (
      <div className="CompanyAddress" key={key}>
        {result}
      </div>
    );
  }

  private renderCompanyInfo = (draft: DraftInterface) => {
    const elements: JSX.Element[] = [];
    if (this.isCompanyInfoFilled(draft)) {
      if (Object.keys(this.props.selectMaps.tradeNames).length > 1) {
        elements.push(
          <FieldCreator
            name="sender"
            model={this.props.internal.model}
            schema={this.props.internal.schema}
            translator={tsxl}
            key={`company-info-${elements.length}`}
            props={{
              label: null,
              automation: this.props.automation + '-draft-as',
              value: draft.invoicer.tradeName._id,
              searchable: true,
              searchPlaceholder: l('search.Default'),
              map: this.props.selectMaps.tradeNames,
              onChange: (value: string) => {
                this.props.changeDraft({
                  ...draft,
                  invoicer: { ...draft.invoicer, tradeName: { ...draft.invoicer.tradeName, _id: value } },
                });
              },
              borderless: true,
            }}
          />,
        );
      } else {
        elements.push(
          <Input
            editable={false}
            value={draft.invoicer.tradeName.name}
            borderless={true}
            automation={this.props.automation + '-draft-as'}
            key={`company-info-${elements.length}`}
          />,
        );
      }
      if (draft.invoicer.tradeName.address) {
        elements.push(this.renderInvoicerAddress(draft.invoicer.tradeName.address, `company-info-${elements.length}`));
      }
      elements.push(
        <div className={'CompanyProfileLink'} key={`company-info-${elements.length}`}>
          <Button
            key={`editCompanyInfoButton`}
            type={ButtonType.link}
            action={() => this.props.navigateToCompanySettings(draft, draft.invoicer.tradeName._id)}
            label={tsxl('CompanyInformationLink', this.props.draft.document)}
            automation={this.props.automation + '-company-settings-link'}
          />
        </div>,
      );
    } else {
      elements.push(
        <div className="SetCompanyInfoBlock" key={`company-info-${elements.length}`}>
          <Button
            type={ButtonType.link}
            automation={'company-info-button'}
            label={l('SetCompanyInfo')}
            action={() => this.props.navigateToCompanySettings(draft, draft.invoicer.tradeName._id)}
          />
        </div>,
      );
    }
    return <div className="CompanyInfo">{elements}</div>;
  };

  private renderPaymentMethods = (draft: DraftInterface) => {
    const heading = <div className="Label">{l('PaymentMethods')}</div>;
    let contents;
    const paymentMeans =
      (draft.paymentMeans &&
        draft.paymentMeans.filter(p => {
          return isValidPaymentMethod(p);
        })) ||
      [];
    if (paymentMeans.length === 0) {
      contents = (
        <div className="SetPaymentMeansBlock">
          <Button
            type={ButtonType.link}
            automation={'payment-means-button'}
            label={l('SetPaymentMeans')}
            action={() => {
              this.props.navigateToCompanySettings(draft);
            }}
          />
        </div>
      );
    } else {
      const paymentMethodOrder = ['iban', 'bban', 'plusgiro', 'bankgiro', 'swish', 'paypal', 'other'];
      const schema = this.props.settings.schemas.paymentMethods;
      const isMethodEnabled = pm => pm && pm.enabled;
      const methods: JSX.Element[] = [];
      paymentMethodOrder.forEach(pmo => {
        if (isMethodEnabled(schema[pmo])) {
          schema[pmo].fields.forEach(f => {
            const pm = paymentMeans.find(pm => pm.type.toLowerCase() === pmo);
            if (pm && pm.fields[f.name]) {
              methods.push(
                <div className="PaymentMethod" key={f.name}>
                  {l(f.label)}: {pm.fields[f.name]}
                </div>,
              );
            }
          });
        }
      });

      contents = (
        <div className="PaymentMethods">
          {methods}
          <Button
            className="EditPaymentMeansButton"
            type={ButtonType.link}
            automation={'payment-means-button'}
            label={l('Edit')}
            action={() => {
              this.props.navigateToCompanySettings(draft);
            }}
          />
        </div>
      );
    }
    return (
      <div className="PaymentMeans">
        {heading}
        {contents}
      </div>
    );
  };

  private checkCustomerAndChangeShowPromotionState = customerId => {
    const isPromotionNotShownAlready =
      localStorage.getItem(`recurring-profile-promotion-for-${customerId}`) !== 'shown-already';
    if (isPromotionNotShownAlready) {
      promotionsApi.getRecurringProfilePromotionTrigger(customerId).then(trigger => {
        if (trigger) {
          localStorage.setItem(`recurring-profile-promotion-for-${customerId}`, 'shown-already');
          this.setState({
            showRecurringProfilePromotion: trigger,
          });
          Analytics.trackEvent(`${Events.recurringInvoiceTip}`, {
            type: AnalyticsType.action,
            category: Category.recurringInvoice,
            result: Result.open,
            placement: Placement.editor,
          });
        }
      });
    }
  };

  public render(): JSX.Element {
    const DRAFT = this.props.draft;
    if (DRAFT === null || DRAFT === undefined || DRAFT.fields === undefined) {
      return null;
    }
    const isVATLessSales = this.isVATLessSales();
    const FIELDS = DRAFT.fields;
    if (!FIELDS) {
      return <h1>Loading invoice</h1>;
    }
    const invoiceTypesMap = { ...this.props.selectMaps.invoiceTypes };

    let discountFormatter: NumberFormatter;
    if (FIELDS.discountType.value === 'amount') {
      discountFormatter = new NumberFormatter(
        Format.fromLocale(this.props.token.locale),
        this.props.internal.currencySymbol,
      );
    } else {
      discountFormatter = new PercentageFormatter(Format.fromLocale(FIELDS.locale.value), true);
    }

    const recurringEnabled =
      this.props.draft.fields.recurringProfileEnabled && this.props.draft.fields.recurringProfileEnabled.value;
    const type = recurringEnabled ? 'recurringProfile' : this.props.draft.document;
    const labels = LabelKeys[type];
    const editorContainerClass = 'editorContent';
    const isEdit = Boolean(
      this.props.draft.editInvoice ||
        (this.props.recurringProfile &&
          this.props.recurringProfile.id &&
          this.props.recurringProfile.status !== RecurringProfileStatusType.DRAFT),
    );
    const saveBtnAutomation = isEdit ? 'header-button-editInvoiceSave' : 'header-button-save';
    const saveBtnLabel = isEdit ? labels.buttons.saveEdit : labels.buttons.save;
    const totalLabel = isVATLessSales ? 'it_total_vatless' : 'ToBePaid';
    const dateFormat = transformDateFormatForMoment(this.props.settings.values.regional.longDate);
    const language = this.props.token.locale.split('_')[0];
    const downPaymentClazz = DRAFT.order ? 'downpayment' : 'downpayment downpayment--disabled';
    const activeDepositType =
      (DRAFT.order && DRAFT.order.orderType.startsWith('downPayment')) ||
      (!DRAFT.order && this.state.orderType === 'downPayment')
        ? 'downPayment'
        : 'schedule';
    const pageTitle = isEdit ? l(labels.phases.edit) : l(labels.phases.create);

    const discountEditable = [DocumentTypes.INVOICE, DocumentTypes.ESTIMATE].includes(DRAFT.document);

    return (
      <div className="ReactEditor" data-automation={this.props.automation} style={{ height: '100%' }}>
        <InvoiceEditorHeading heading={pageTitle} closeAction={() => this.props.closeEditor(this.props.draft)}>
          {this.props.draft.document !== 'creditnote' && (
            <Button
              label={l(saveBtnLabel)}
              automation={saveBtnAutomation}
              action={() => {
                !this.props.hasRightsToRecurringProfile && FIELDS.recurringProfileEnabled.value
                  ? this.props.openRecurringProfileIntermediaryModal()
                  : this.props.draftSaveAndClose(this.props.draft);
              }}
            />
          )}
          <Button
            label={l(labels.buttons.next)}
            automation="header-button-next"
            type={ButtonType.accept}
            action={() => {
              !this.props.hasRightsToRecurringProfile && FIELDS.recurringProfileEnabled.value
                ? this.props.openRecurringProfileIntermediaryModal()
                : FIELDS.recurringProfileEnabled.value
                ? this.props.previewRecurringProfile(this.props.draft, this.props.recurringProfile)
                : this.props.previewDraft(this.props.draft);
            }}
          />
        </InvoiceEditorHeading>
        <div className={editorContainerClass}>
          <Layout>
            <LayoutColumn style={{ flexGrow: 3 }}>
              {this.getRecurringSettings(FIELDS)}
              <Document automation={this.props.automation} className="InvoiceEditor">
                <h1 className="title">{FIELDS.title.value}</h1>
                <CustomerSelector
                  customers={this.props.customers ? this.props.customers.collection : []}
                  value={DRAFT.receiver}
                  onChange={customer => {
                    this.props.changeCustomer(customer);
                    if (customer && customer.id) {
                      this.checkCustomerAndChangeShowPromotionState(customer.id);
                    }
                  }}
                  containerClass={editorContainerClass}
                  invalid={this.props.draft.invalidFields && this.props.draft.invalidFields.indexOf('customer') >= 0}
                  readOnly={this.props.draft.document === 'creditnote' || this.isEditingApprovedInvoice()}
                  openCustomerModal={() => {
                    this.props.openCustomerModal(DRAFT.receiver);
                  }}
                />
                <hr />
                <InvoiceHeader
                  onChange={(field: FieldInterface) => {
                    this.props.draft.fields[field.name.toString()] = field;
                    this.props.changeFields({ ...this.props.draft.fields });
                  }}
                  settings={this.props.settings}
                  model={this.props.internal.model}
                  schema={this.props.internal.schema}
                  fields={this.props.draft.fields}
                  invalidFields={this.props.draft.invalidFields}
                  automation={'invoiceHeader'}
                  locale={this.props.token.locale}
                  country={this.props.company.country}
                  onDocumentNumberEdit={this.props.onDocumentNumberEdit}
                  editableInvoiceNumberInput={this.props.draft.document === DocumentTypes.ESTIMATE}
                  invoiceNumberEditable={
                    (this.props.draft.document === 'invoice' && !this.isEditingApprovedInvoice()) ||
                    this.props.draft.document === 'creditnote'
                  }
                />
                <InvoiceItems
                  products={this.props.products}
                  lines={DRAFT.lines}
                  settings={this.props.settings}
                  fields={this.props.draft.fields}
                  columns={this.props.internal.lineColumns as Array<keyof LineInterface>}
                  onChange={values => {
                    this.props.changeLines(values);
                  }}
                  locale={this.props.token.locale}
                  currencySymbol={this.props.internal.currencySymbol}
                  readOnly={this.props.draft.document === 'creditnote'}
                  openProductModal={index => this.props.openProductModal(index)}
                  openVATOptions={() => this.props.openVATOptions()}
                  openUnitOptions={() => this.props.openUnitOptions()}
                />

                <Layout>
                  <LayoutColumn>
                    {this.props.draft.document !== 'creditnote' && (
                      <Button
                        className="addItemButton"
                        label={tsxl('New')}
                        action={() => {
                          this.props.draft.lines.push(defaultLine(this.props.settings));
                          this.props.changeLines(this.props.draft.lines);
                        }}
                        automation="invoiceItem-addLine"
                      >
                        <Button
                          label={tsxl('New')}
                          action={() => {
                            this.props.draft.lines.push(defaultLine(this.props.settings));
                            this.props.changeLines(this.props.draft.lines);
                          }}
                          automation="invoiceItem-addLine"
                        />
                        <Button
                          label={tsxl('invoice.add.Subtitle')}
                          action={() => {
                            this.props.draft.lines.push(InvoiceTitleLine.defaultProps);
                            this.props.changeLines(this.props.draft.lines);
                          }}
                          automation="invoiceItem-addTitle"
                        />
                        <Button
                          label={tsxl('invoice.add.Description')}
                          action={() => {
                            // @ts-ignore
                            const o: TextLineInterface = {
                              ...InvoiceTextLine.defaultProps,
                              content: '',
                              type: 'description',
                            };
                            this.props.draft.lines.push(o);
                            this.props.changeLines(this.props.draft.lines);
                          }}
                          automation="invoiceItem-addDescription"
                        />
                        <Button
                          label={tsxl('invoice.add.Subtotal')}
                          action={() => {
                            const { lineColumns } = this.props.internal;
                            const isNetTotal = lineColumns.indexOf('netTotal') >= 0;
                            const isTaxTotal = lineColumns.indexOf('taxTotal') >= 0;
                            this.props.draft.lines.push(SubtotalLine.generateDefaultProps(isNetTotal, isTaxTotal));
                            this.props.changeLines(this.props.draft.lines);
                          }}
                          automation="invoiceItem-addSubtotal"
                        />
                      </Button>
                    )}
                  </LayoutColumn>
                  <LayoutColumn style={{ flexBasis: '300px', flexGrow: 0 }}>
                    <div className="sumArea">
                      {FIELDS.discountEnabled.value && FIELDS.discountLocation.value === 'perTotal' && (
                        <NumberInput
                          decimals={2}
                          key={'amount'}
                          formatter={discountFormatter}
                          automation={this.props.automation + '-discount'}
                          value={FIELDS.discountAmount.value}
                          label={tsxl('DiscountGiven', this.props.draft.document)}
                          onBlur={value => {
                            this.props.changeFields({
                              ...FIELDS,
                              discountAmount: { name: 'discountAmount', value },
                            });
                          }}
                          editable={discountEditable}
                          borderless={!discountEditable}
                        />
                      )}
                      {FIELDS.discountEnabled.value && FIELDS.discountLocation.value === 'perTotal' && (
                        <hr className="full" />
                      )}
                      {!isVATLessSales && (
                        <NumberInput
                          decimals={2}
                          editable={false}
                          borderless={true}
                          value={DRAFT.summary.netTotal}
                          automation={this.props.automation + '-net'}
                          formatter={this.currencyF}
                          label={tsxl('invoice.totalAmount')}
                        />
                      )}
                      {!this.props.internal.taxFree &&
                        DRAFT.summary.taxSummary.map(vat => {
                          return (
                            vat.percentage > 0 && (
                              <NumberInput
                                decimals={2} // do not show VAT 0% as it is always 0
                                formatter={this.currencyF}
                                editable={false}
                                key={'vat' + vat.percentage}
                                automation={this.props.automation + '-vat-' + vat.percentage}
                                borderless={true}
                                label={
                                  l('Tax') + ' ' + convertVatpctFromLocale(vat.percentage, this.props.token.locale)
                                }
                                value={vat.amount}
                              />
                            )
                          );
                        })}

                      {!this.props.internal.taxFree && DRAFT.summary.taxSummary.length > 1 && (
                        <NumberInput
                          decimals={2}
                          borderless={true}
                          editable={false}
                          value={DRAFT.summary.taxTotal}
                          automation={this.props.automation + '-vat'}
                          formatter={this.currencyF}
                          label={tsxl('invoice.VatTotal')}
                        />
                      )}

                      {FIELDS.discountEnabled.value && (
                        <NumberInput
                          decimals={2}
                          borderless={true}
                          editable={false}
                          formatter={this.currencyF}
                          value={this.props.draft.summary.discountTotal}
                          automation={this.props.automation + '-discountGiven'}
                          label={tsxl('invoice.DiscountGiven')}
                        />
                      )}
                      {[InvoiceTypes.SALES_HOUSEHOLD_SE_ROT, InvoiceTypes.SALES_HOUSEHOLD_SE_RUT].includes(
                        Number(FIELDS.type.value),
                      ) &&
                        !!DRAFT.summary.reductionTotal && [
                          <div className="sum">
                            <NumberInput
                              decimals={2}
                              borderless={true}
                              editable={false}
                              value={DRAFT.summary.grossTotal}
                              automation={this.props.automation + '-sum'}
                              formatter={this.currencyF}
                              label={tsxl('Sum')}
                            />
                          </div>,
                          <div className="reduction">
                            <NumberInput
                              decimals={2}
                              borderless={true}
                              editable={false}
                              value={-1 * DRAFT.summary.reductionTotal}
                              automation={this.props.automation + '-deductionTotal'}
                              formatter={this.currencyF}
                              label={tsxl(
                                FIELDS.type.value === 10
                                  ? 'invoice.total.SALES_HOUSEHOLD_SE_ROT'
                                  : 'invoice.total.SALES_HOUSEHOLD_SE_RUT',
                              )}
                            />
                          </div>,
                        ]}
                      <hr className="full" />
                      <div className="total">
                        <NumberInput
                          decimals={2}
                          borderless={true}
                          editable={false}
                          value={
                            [10, 11].includes(Number(FIELDS.type.value))
                              ? DRAFT.summary.grossTotal - DRAFT.summary.reductionTotal
                              : DRAFT.summary.grossTotal
                          }
                          automation={this.props.automation + '-total'}
                          formatter={this.currencyF}
                          label={tsxl(totalLabel)}
                        />
                      </div>
                    </div>
                    {this.orderActive(DRAFT) && (
                      <div className={downPaymentClazz}>
                        {activeDepositType === 'downPayment'
                          ? this.renderDownPaymentBlock(DRAFT, dateFormat, language)
                          : this.renderPaymentScheduleBlock(DRAFT, dateFormat, language)}
                      </div>
                    )}
                  </LayoutColumn>
                </Layout>
                <hr />
                <div className="footer">
                  <Layout>
                    <LayoutColumn>
                      <FieldCreator
                        name="footerText"
                        model={this.props.internal.model}
                        schema={this.props.internal.schema}
                        translator={tsxl}
                        props={{
                          value: FIELDS.footerText ? FIELDS.footerText.value : '',
                          labelPosition: 'top',
                          automation: this.props.automation + '-footnote',
                          invalid:
                            this.props.draft.invalidFields && this.props.draft.invalidFields.indexOf('footerText') >= 0,
                          onBlur: (value: string) => {
                            this.props.changeFields({
                              ...FIELDS,
                              footerText: { ...FIELDS.footerText, value },
                            });
                          },
                          editable: this.props.draft.document !== 'creditnote',
                          borderless: this.props.draft.document === 'creditnote',
                          maxLength: 250,
                          showCounter: true,
                        }}
                      />
                    </LayoutColumn>
                    <LayoutColumn>{this.renderPaymentMethods(DRAFT)}</LayoutColumn>
                  </Layout>
                </div>
              </Document>
            </LayoutColumn>
            <LayoutColumn style={{ flexGrow: 0, flexBasis: '240px' }}>
              {this.props.draft.document !== 'creditnote' && (
                <Document type="Panel" className={'sidePanel'}>
                  {this.renderCompanyInfo(DRAFT)}
                  <InvoiceSettings
                    {...this.props}
                    handleCurrencyChange={this.handleCurrencyChange}
                    handleExchangeRateChange={this.handleExchangeRateChange}
                  />
                  <div>
                    <DiscountSettings
                      label={l('discountSettings', this.props.draft.document)}
                      automation={this.props.automation + '-discount'}
                      discountLocation={
                        [InvoiceTypes.SALES_HOUSEHOLD_SE_ROT, InvoiceTypes.SALES_HOUSEHOLD_SE_RUT].includes(
                          FIELDS.type.value,
                        )
                          ? 'perLine'
                          : FIELDS.discountLocation.value
                      }
                      discountType={FIELDS.discountType.value}
                      discountVAT={FIELDS.discountVAT.value}
                      discountState={FIELDS.discountEnabled.value ? 'on' : 'off'}
                      currency={FIELDS.currency.value}
                      discountLocationsMap={{
                        ...(![InvoiceTypes.SALES_HOUSEHOLD_SE_ROT, InvoiceTypes.SALES_HOUSEHOLD_SE_RUT].includes(
                          FIELDS.type.value,
                        )
                          ? { perTotal: l('document.perTotal') }
                          : {}),
                        perLine: l('document.perLine'),
                      }}
                      onDiscountStateChange={(discountState: DiscountState) => {
                        const amount = discountState === 'on' ? FIELDS.discountAmount.value : 0;
                        this.props.changeFields({
                          ...FIELDS,
                          discountEnabled: { name: 'discountEnabled', value: discountState === 'on' },
                          discountAmount: { name: 'discountAmount', value: amount },
                        });
                        if (discountState === 'off') {
                          DRAFT.lines.forEach((line: InvoiceItemType) => {
                            if (Type.isInvoiceLine(line)) {
                              if (line.discount > 0) {
                                line.discount = 0;
                                line.totalDiscount = 0;
                              }
                            }
                          });
                          this.props.changeLines(DRAFT.lines);
                        }
                      }}
                      onDiscountLocationChange={(discountLocation: DiscountLocation) => {
                        this.props.changeFields({
                          ...FIELDS,
                          discountLocation: { name: 'discountLocation', value: discountLocation },
                        });
                      }}
                      onDiscountTypeChange={(discountType: DiscountType) => {
                        this.props.changeFields({
                          ...FIELDS,
                          discountType: { name: 'discountType', value: discountType },
                        });
                      }}
                      onDiscountVATChange={(discountVAT: DiscountVAT) => {
                        this.props.changeFields({
                          ...FIELDS,
                          discountVAT: { ...FIELDS.discountVAT, value: discountVAT },
                        });
                      }}
                      showDiscountVAT={this.props.selectMaps.columnNames['taxTotal'] !== undefined}
                    />
                  </div>
                  {this.showRecurringProfileToolTip()}
                  {this.getRecurringToggle(FIELDS)}
                  {this.getDownPaymentSettings(FIELDS)}
                </Document>
              )}
              {this.props.draft.document === 'creditnote' && (
                <Document type="Panel">
                  <Input
                    automation={this.props.automation + '-draft-as'}
                    value={this.props.selectMaps.tradeNames[DRAFT.invoicer.tradeName._id]}
                    editable={false}
                    borderless={true}
                    label={l('invoice.InvoicingProfile')}
                  />
                  <hr />

                  <Input
                    automation={this.props.automation + '-invoice-type'}
                    value={this.props.selectMaps.invoiceTypes[FIELDS.type.value]}
                    editable={false}
                    borderless={true}
                    label={l('invoice.Type')}
                  />
                  <hr />

                  <Input
                    automation={this.props.automation + '-template'}
                    value={this.props.selectMaps.templates[this.props.internal.template]}
                    editable={false}
                    borderless={true}
                    label={l('invoice.Template')}
                  />
                  <hr />

                  <Input
                    automation={this.props.automation + '-visible-columns'}
                    value={this.props.internal.visibleColumns
                      .map(key => {
                        return this.props.selectMaps.columnNames[key];
                      })
                      .filter(i => i)
                      .join(', ')}
                    dataValue={this.props.internal.visibleColumns.join(',')}
                    editable={false}
                    borderless={true}
                    label={l('invoice.Fields')}
                  />
                  <hr />

                  <Input
                    automation={this.props.automation + '-currency'}
                    value={this.props.selectMaps.currencies[FIELDS.currency.value]}
                    editable={false}
                    borderless={true}
                    label={l('Currency')}
                  />
                  <hr />

                  <Input
                    automation={this.props.automation + '-language'}
                    value={this.props.selectMaps.languages[this.props.internal.language]}
                    editable={false}
                    borderless={true}
                    label={l('InvoiceLanguage')}
                  />
                  <hr />

                  <Input
                    automation={this.props.automation + '-title'}
                    value={FIELDS.title.value}
                    editable={false}
                    borderless={true}
                    label={l('invoice.Title')}
                  />
                  <hr />
                  <div className="Controlled Input SettingsLink">
                    <span className="Label" onClick={() => this.props.navigateToInvoicingSettings()}>
                      {tsxl('AdvancedSettings', this.props.draft.document)}
                    </span>
                  </div>
                </Document>
              )}
            </LayoutColumn>
          </Layout>
        </div>
      </div>
    );
  }
}
