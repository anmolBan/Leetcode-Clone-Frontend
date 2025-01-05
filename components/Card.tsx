export const Card = ({children} : {children : React.ReactNode}) => {
    return (
        <div className=" min-w-64 max-w-72 px-5 py-2 bg-white border border-gray-200 rounded-lg shadow-lg">
            {children}
        </div>
    )
}