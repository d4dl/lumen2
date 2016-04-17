conn = new Mongo();
//db = conn.getDB("khabelestrong");
cursor = db.DebitSchedule.find();
//while ( cursor.hasNext() ) {
//    printjson( cursor.next() );
//}