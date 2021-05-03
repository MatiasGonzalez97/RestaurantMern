let restaurants

export default class RestaurantsDAO {
    static async injectDB(conn){
        if(restaurants) {
            return;
        }
        try{
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection('restaurants')
        } catch(e) {
            console.log(e.stack)
            console.error(`No se pudo conectar con la bd : ${e}`)
        }
    }

    static async getRestaurants({
        filters = null,
        page = 0,
        restaurantsPerPage = 20,
    } ={} ) {
        let query 
        if(filters) {
            if('name' in filters) {
                query = {$text : {$search : filters['name']}} //Busca por nombre
            } else if('cuisine' in filters) {
                query = {'cuisine' :{$equals : filters['cuisine']}} //Busca en cuisine
            } else if('zipcode' in filters) {
                query = {'zipcode' : {$equals : filters['zipcode']}} //Busca en zipcode
            }
        }

        let cursor

        try{
            cursor = await restaurants.find(query)
        } catch(e) {
            console.error(`No se pudo encontrar resultados : ${e}`)
            return {RestaurantsList : [], totalNumRestaurants:0}
        }

        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)

        try{
            const restaurantsList = await displayCursor.toArray()
            const totalNumRestaurants = await restaurants.countDocuments(query)
            return {restaurantsList, totalNumRestaurants}
        } catch(e) {
            console.error(
                `No se pudo convertir cursor a array o problema contando documentos : ${e}`
            )

            return {restaurantsList: [], totalNumRestaurants:0}
        }

    }
}
