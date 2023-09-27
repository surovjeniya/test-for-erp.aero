load_env(){
    PWD_ENV=$PWD/envs/infra.env;
    echo "=======> Using envs from ${PWD_ENV}. <=========";
}

load_docker_compose(){
  DOCKER_COMPOSE_PATH=$PWD/docker-compose.yml;
  echo "=======> Using docker-compose from ${DOCKER_COMPOSE_PATH}. <=========";
}



help(){
    echo "cases: dev (run db only), prod (run db and api)"
    exit 1;
}

_PARAM_TARGET=$1

case $_PARAM_TARGET in
  "dev") load_env; load_docker_compose; docker-compose -f $DOCKER_COMPOSE_PATH --env-file $PWD_ENV --profile dev up --build;;
  "prod") load_env; load_docker_compose; docker-compose -f $DOCKER_COMPOSE_PATH --env-file $PWD_ENV --profile prod up --build -d;;
  *) help;;
esac
