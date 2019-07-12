import { CheckBoxAdapter } from 'fuse-design/data-input/checkbox';
import { DropDown } from 'fuse-design/data-input/dropdown';
import { Form, FormColumn, FormGrid } from 'fuse-design/data-input/form';
import { AdminGallery } from 'fuse-design/data-input/gallery';
import { Input } from 'fuse-design/data-input/input';
import { Block } from 'fuse-design/display/block';
import { SectionHeader } from 'fuse-design/display/headers';
import { Fusion } from 'fuse-react';
import * as React from 'react';
import { Schema } from 'schema';
import { MelaStore } from 'Store';
import { GoogleMaps } from 'ui/GoogleMaps/GoogleMaps';

const store = MelaStore.getInstance<MelaStore>();

export class PropertyForm extends Fusion<
  {
    form?: any;
    children?: any;
  },
  any
> {
  public formLocation() {
    const form = this.props.form;

    return (
      <Block>
        <SectionHeader icon="location-arrow" style="primary" text="Location" />
        <Form>
          <FormGrid>
            <FormColumn size={1}>
              <GoogleMaps form={form} name="location" />
            </FormColumn>
          </FormGrid>
        </Form>
      </Block>
    );
  }

  public formPropertyPlan() {
    const form = this.props.form;
    return (
      <Block>
        <SectionHeader icon="map" style="primary" text="Property plan" />
        <Form>
          <FormGrid>
            <FormColumn size={2}>
              <DropDown label="Bedrooms" form={form} name="bedrooms" data={[1, 2, 3, 4, 5]} />
            </FormColumn>
            <FormColumn size={2}>
              <DropDown label="Bathrooms" form={form} name="bathrooms" data={[1, 2, 3, 4, 5]} />
            </FormColumn>
          </FormGrid>

          <FormGrid>
            <FormColumn size={2}>
              <Input label="Square Meters" form={form} name="sq_meters" />
            </FormColumn>
            <FormColumn size={2}>
              <Input label="Year built" form={form} name="year_built" />
            </FormColumn>
          </FormGrid>
        </Form>
      </Block>
    );
  }

  public gallery() {
    const form = this.props.form;
    return (
      <Block>
        <SectionHeader icon="images" style="primary" text="Image gallery" />
        <Form>
          <AdminGallery
            mainImageKey="main_picture"
            form={form}
            name="image_gallery"
            getURL={image => store.settings.cdn + '/' + image + '?width=500&quality=90'}
          />
        </Form>
      </Block>
    );
  }

  public formFeatures() {
    const form = this.props.form;
    return (
      <Block>
        <SectionHeader icon="tags" style="primary" text="Property features" />
        <Form>
          <CheckBoxAdapter
            selectAllCheckBox="Select all"
            rowLimit={10}
            name="tags"
            form={form}
            data={Schema.propertyTags.asCheckBoxData()}
          />
        </Form>
      </Block>
    );
  }
  public formEssential() {
    const form = this.props.form;
    return (
      <Block>
        <SectionHeader icon="user-tie" style="primary" text="Essential information" />
        <Form>
          <FormGrid>
            <FormColumn size={1}>
              <Input form={form} name="title" label="Property title" />
            </FormColumn>
          </FormGrid>
          <FormGrid>
            <FormColumn size={2}>
              <DropDown
                label="Property type"
                form={form}
                name="property_type"
                data={Schema.propertyTypeSchema.asData()}
              />
            </FormColumn>
            <FormColumn size={2}>
              <DropDown
                label="Listing type type"
                form={form}
                name="listing_type"
                data={Schema.listingTypeSchema.asData()}
              />
            </FormColumn>
          </FormGrid>

          <FormGrid>
            <FormColumn size={1}>
              <Input form={form} name="price" label="Property price (EUR)" />
            </FormColumn>
          </FormGrid>

          <FormGrid>
            <FormColumn size={1}>
              <Input type="textarea" form={form} name="description" label="Property description" />
            </FormColumn>
          </FormGrid>

          {/* <FormGrid>
						<FormColumn size={1}>
							<ContentAligner right={<Button onClick={() => void 0}>Edit property</Button>} />
						</FormColumn>
					</FormGrid> */}
        </Form>
      </Block>
    );
  }
  public render() {
    const form = this.props.form;
    return (
      <div className="property-form">
        {this.formEssential()}
        {this.formLocation()}
        {this.formPropertyPlan()}
        {this.gallery()}
        {this.formFeatures()}
        {this.props.children}
      </div>
    );
  }
}
