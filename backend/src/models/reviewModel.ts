import { modelOptions, prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { Product } from './productModel'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Review {
  public _id?: string

  @prop({ ref: () => Product, required: true })
  public product!: Ref<Product>

  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public rating!: number

  @prop({ required: true })
  public comment!: string
}

export const ReviewModel = getModelForClass(Review)
