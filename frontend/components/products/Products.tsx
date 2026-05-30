import { useProduct } from '@/hooks/useProducts'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ListCheckIcon } from 'lucide-react'

const Products = () => {
  const { products, error, isEmpty, loading, refetch } = useProduct()
  if (loading) {
    return (<div>Loading...</div>)
  }
  if (isEmpty) {
    return (<div>there is nothing to show !</div>)
  }
  if (products) {
    console.log(products)
  }
  const productsTag = products.data.map((item, index) => {
    return (
      <Card key={item._id} className='p-6 w-full min-w-2xs flex flex-col items-center justify-center' >
        <CardHeader className='flex justify-center items-center w-full'>
          <CardTitle className=''>

            <h3>{item.title}</h3>


          </CardTitle>
        </CardHeader>

        <CardContent className='pl-0'>
          <p>{item.description}</p>

        </CardContent>








      </Card >
    )

  })
  return (
    <div>{productsTag}</div>
  )
}

export default Products