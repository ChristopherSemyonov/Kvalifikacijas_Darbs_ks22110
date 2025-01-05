import { Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import {
  useGetAllOrderHistoryQuery,
  useDeliverOrderMutation,
  useDeleteOrderMutation,
} from '../hooks/orderHooks'
import { ApiError } from '../types/ApiError'
import { getError } from '../utils'
import { toast } from 'react-toastify'

export default function OrderDeliveryManagementPage() {
  const navigate = useNavigate()
  const {
    data: orders,
    isLoading,
    error,
    refetch,
  } = useGetAllOrderHistoryQuery()
  const { mutate: deliverOrder } = useDeliverOrderMutation()
  const { mutate: deleteOrder } = useDeleteOrderMutation()

  const deliverHandler = async (orderId: string) => {
    try {
      await deliverOrder(orderId)
      toast('Order marked as delivered')
      refetch()
    } catch (err) {
      toast(getError(err as unknown as ApiError))
    }
  }

  const deleteHandler = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(orderId)
        toast('Order deleted successfully')
        refetch()
      } catch (err) {
        toast(getError(err as unknown as ApiError))
      }
    }
  }

  return (
    <div>
      <Helmet>
        <title>Order delivery</title>
      </Helmet>

      <h1>Deliver orders:</h1>
      {isLoading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">
          {getError(error as unknown as ApiError)}
        </MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>DATE ORDERED</th>
              <th>TOTAL</th>
              <th>DATE PAID</th>
              <th>DELIVERY STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders!.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : 'Not delivered'}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    className="management-buttons"
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    Details
                  </Button>
                  <Button
                    type="button"
                    variant="success"
                    className="management-buttons"
                    disabled={order.isDelivered}
                    onClick={() => deliverHandler(order._id)}
                  >
                    Deliver
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    className="management-buttons"
                    onClick={() => deleteHandler(order._id)}
                  >
                    Delete Order
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
