from fabric.api import prefix, run, cd

def pull_git():
    run('git pull')

def collect_static():
    # To work with virtualenvwrapper make sure the line
    # [ -z "$PS1" ] && return
    # is commented in your .bashrc
    with prefix('workon drglearning'):
        run('python manage.py collectstatic')

def update_server(static_files=False):
    drglearning_dir = '~/git/drglearning'
    with cd(drglearning_dir):
        run("ls")
        pull_git()
        if static_files:
            collect_static()
        run('run/stop.sh')
        run('run/start.sh')
