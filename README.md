# bouncy-forever
Wiring up bouncy and forever to provide a streamlined service:
1. Launch multiple servers(processes) and have them listen to different ports.
2. Forward requests for multiple domains to the desired servers(processes).

## Install
```bash
> npm install -g bouncy-forever
```

## Usage
This package aims at simple setup for doing the job. There are only 2 steps in setting this up. 
1. Create a configuration file at `~/.bouncy-forever/config.json`
2. Run the bouncy-forever server: `> bouncyforever`

### The configuration file (`~/.bouncy-forever/config.json`)
File structure: 
```json
{
  "cv.ycmjason.com": {
    "name": "cv",
    "start_script": "npm start",
    "base_dir": "~/Development/curriculum-vitae"
  },
  "ycmjason.com": {
    "name": "ycmjason.com",
    "start_script": "python server.py --prod --port=$PORT",
    "base_dir": "~/Development/ycmjason.com",
    "env": {
      "MAX_VISITOR": "16"
    }
  }
}
```
*Do NOT specify `env.PORT` for your app since bouncy-forever will assign it to a free port.* 

This also means that your app should listen to `env.PORT` for bouncy-forever to work. 

Alternatively, you can specify the port by using `$PORT` in your `start_script` entry. You could see this in the above example.



### Command Line Interface (CLI)
To run the server:
```
> bouncyforever

`cv` launched and listening on port 38186...
`ycmjason.com` launched and listening on port 46606...

Mapping...
  cv.ycmjason.com:8080(cv) to port 38186
  ycmjason.com:8080(ycmjason.com) to port 46606
bouncy-forever server launched and listening on port 8080...
```

You can also run the server as a daemon (i.e. in the background):
```
> bouncyforever start
Starting bouncy-forever-server daemon...
bouncy-forever-server daemon started. PID: 10614

> bouncyforever restart
Stopping bouncy-forever-server daemon...
bouncy-forever-server daemon stopped.
Starting bouncy-forever-server daemon...
bouncy-forever-server daemon started. PID: 11023

> bouncyforever stop
Stopping bouncy-forever-server daemon...
bouncy-forever-server daemon stopped.
```

The bouncy-forever server will listen on port `8080` by default but could easily be changed by specifying the `PORT` environment variable:
```bash
> PORT=80 bouncyforever
```

### Logs
The output of your apps will be piped into the following directory `~/.bouncy-forever/logs/`. 
```
> cd ~/.bouncy-forever/logs/
> ls
cv/  ycmjason.com/
> cd cv
> ls
out.log
> cat out.log
Listening on 38186...
```

## License
MIT
