import { createFileRoute, Link } from '@tanstack/react-router'
import { Suspense, use } from 'react'

export const Route = createFileRoute('/(play)/again/')({
  component: RouteComponent,
  loader: async () => {
    const myResponse = fetch('https://jsonplaceholder.typicode.com/todos?_limit=6').then((r) =>
      r.json()
    )

    return { myResponse } // <-- promise, not awaited here
  },
})

function RouteComponent() {
  const { myResponse } = Route.useLoaderData()
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 min-h-screen">
      <h1>This is AGAIN SCREEN with slow data</h1>
      <Link to="/play">Play</Link>
      <Suspense fallback={<div>Loading...</div>}>
        <MyData res={myResponse} />
      </Suspense>
    </div>
  )
}

function MyData({ res }: { res: any }) {
  const data = use(res)
  return (
    <div>
      <h1>This is my data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
