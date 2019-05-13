var config = {
 tcp: {
    'IP' : '40.76.42.243',
    'PORT' : 21684
  },
  
     'db':  {
     userName: 'TitanAdmin', // update me
     password: 'Titan123', // update me
     server: 'titanserver.database.windows.net', // update me
     options:
        {
           database: 'TitanDB' //update me
           , encrypt: true
        }
	 }
  

}
module.exports = config;

