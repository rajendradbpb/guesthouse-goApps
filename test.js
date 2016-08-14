cursor = db.collection.find();
while ( cursor.hasNext() ) {
   print( cursor.next() );
}