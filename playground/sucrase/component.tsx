import { MelaStore } from 'Store';
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
              <DropDown data={[1, 2, 3, 4, 5]} form={form} label="Bedrooms" name="bedrooms" />
            </FormColumn>
            <FormColumn size={2}>
              <DropDown data={[1, 2, 3, 4, 5]} form={form} label="Bathrooms" name="bathrooms" />
            </FormColumn>
          </FormGrid>

          <FormGrid>
            <FormColumn size={2}>
              <Input form={form} label="Square Meters" name="sq_meters" />
            </FormColumn>
            <FormColumn size={2}>
              <Input form={form} label="Year built" name="year_built" />
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
            form={form}
            getURL={image => store.settings.cdn + '/' + image + '?width=500&quality=90'}
            mainImageKey="main_picture"
            name="image_gallery"
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
            data={Schema.propertyTags.asCheckBoxData()}
            form={form}
            name="tags"
            rowLimit={10}
            selectAllCheckBox="Select all"
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
              <Input form={form} label="Property title" name="title" />
            </FormColumn>
          </FormGrid>
          <FormGrid>
            <FormColumn size={2}>
              <DropDown
                data={Schema.propertyTypeSchema.asData()}
                form={form}
                label="Property type"
                name="property_type"
              />
            </FormColumn>
            <FormColumn size={2}>
              <DropDown
                data={Schema.listingTypeSchema.asData()}
                form={form}
                label="Listing type type"
                name="listing_type"
              />
            </FormColumn>
          </FormGrid>

          <FormGrid>
            <FormColumn size={1}>
              <Input form={form} label="Property price (EUR)" name="price" />
            </FormColumn>
          </FormGrid>

          <FormGrid>
            <FormColumn size={1}>
              <Input form={form} label="Property description" name="description" type="textarea" />
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
