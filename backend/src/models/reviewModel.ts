import { modelOptions, prop, Ref, getModelForClass } from '@typegoose/typegoose'
import { Product } from './productModel' // Import the Product model

@modelOptions({ schemaOptions: { timestamps: true } })
export class Review {
  public _id?: string

  @prop({ required: true, ref: () => Product })
  public productId!: Ref<Product> // Reference to the Product

  @prop({ required: true })
  public name!: string // Reviewer's name

  @prop({ required: true })
  public rating!: number // Rating from 0 to 5

  @prop({ required: true })
  public comment!: string // Review comment
}

export const ReviewModel = getModelForClass(Review)
