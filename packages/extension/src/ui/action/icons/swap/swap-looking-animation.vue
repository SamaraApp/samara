<template>
  <svg
    id="a"
    class="pulse"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 270.81 218.88"
  >
    <g id="b">
      <path
        fill="#eee"
        d="M270.81,15.59l-53.71,53.71H89.53c-1.88,0-3.47,.65-4.77,1.95s-1.95,2.89-1.95,4.77,.65,3.47,1.95,4.77,2.89,1.95,4.77,1.95h93.99c16.65,0,30.88,5.91,42.7,17.72s17.72,26.05,17.72,42.7-5.91,30.88-17.72,42.7-26.05,17.72-42.7,17.72H2.25l53.71-53.71h127.56c1.88,0,3.47-.65,4.77-1.95s1.95-2.89,1.95-4.77-.65-3.47-1.95-4.77-2.89-1.95-4.77-1.95H89.53c-16.65,0-30.88-5.91-42.7-17.72s-17.72-26.05-17.72-42.7,5.91-30.88,17.72-42.7,26.05-17.72,42.7-17.72h181.28Z"
      />
    </g>
  </svg>
</template>

<style scoped>
svg {
  display: inline-block;
  vertical-align: baseline;
}
</style>

<style>
@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

.pulse {
  -webkit-animation-name: pulse;
  animation-name: pulse;
  animation-duration: 2s;
}
</style>
